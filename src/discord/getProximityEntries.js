const puppeteer = require('puppeteer');
const { gotoNextPage, insertEntries } = require('../database/scrapeEntries');

module.exports = async function (bot) {
  console.log('Now scraping...');
  const browser = await puppeteer.launch({
    // headless: false,
    'args': [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();

  await page.goto('http://107.155.100.182:50313/spenefett/fwd');
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', process.env.DARKFALL_USER);
  await page.type('input[name="password"]', process.env.DARKFALL_PASS);
  await page.click('div[id="loginButton"]');
  await page.waitForSelector('div[id="OGB_Clan"]');
  await page.click('div[id="OGB_Clan"]');
  await page.waitForSelector('div[id^="menu_toggle"]');
  await page.click('div[id^="menu_toggle"]');
  await page.waitForSelector('td[id^=menu_td_1] tr:nth-child(2) td:nth-child(2) li:last-child');
  await page.waitForSelector('tr[class="overview_back"]');
  await page.click('td[id^=menu_td_1] tr:nth-child(2) td:nth-child(2) li:last-child');
  await page.waitForSelector('div[id^="CheckBoxGroup"]');
  await page.click('em[id^="checkdeselectall"]');
  await page.click('div[id^="CheckBoxGroup"] tbody tr:first-child td:nth-child(3) div');
  await page.click('input[id^=formButton]');

  let entries = [];

  async function scrapePage() {
    const timestampArr = await page.evaluate(
      () => [...document.querySelectorAll('div[align="center"] > div > div > div > div[align="center"] b')].map(elem => elem.innerText)
    );

    const entry = await page.evaluate(({ timestampArr, entries }) => [...document.querySelectorAll('div[align="center"] > div > div > div div[align="left"]')].map((ele, i) => {
      let elem = ele.innerText;

      let clanStatus =
        (elem.indexOf('from our clan the') !== -1) ? 'OWN' :
          (elem.indexOf('from the Clan of the') !== -1) ? 'OTHER' :
            'NONE';

      let entry = {};
      entry.timeStamp = timestampArr[i];

      switch (clanStatus) {
        case 'OWN': {
          elem = elem.split(' ');
          entry.rank = elem.shift();
          elem = elem.join(' ');
          entry.ourClan = true;

          let mark1 = 'from our clan the';
          entry.username = elem.substring(0, elem.indexOf(mark1)).trim();
          elem = elem.substring(elem.indexOf(mark1) + mark1.length).trim();

          let mark2 = (elem.indexOf('left our city of') !== -1) ? 'left our city of' : 'entered our city of';
          if (mark2 === 'left our city of') entry.inCity = false;
          else if (mark2 === 'entered our city of') entry.inCity = true;
          entry.clan = elem.substring(0, elem.indexOf(mark2)).trim();
          elem = elem.substring(elem.indexOf(mark2) + mark2.length);
          entry.city = elem.trim().substring(0, elem.length - 2);
          break;
        }
        case 'OTHER': {
          elem = elem.split(' ');
          entry.rank = elem.shift();
          elem = elem.join(' ');
          entry.ourClan = false;
          let mark1 = 'from the Clan of the';
          entry.username = elem.substring(0, elem.indexOf(mark1)).trim();
          elem = elem.substring(elem.indexOf(mark1) + mark1.length).trim();

          let mark2 = (elem.indexOf('has left our city of') !== -1) ? 'has left our city of' : 'has been spotted in our city of';
          if (mark2 === 'has left our city of') entry.inCity = false;
          else if (mark2 === 'has been spotted in our city of') entry.inCity = true;
          entry.clan = elem.substring(0, elem.indexOf(mark2)).trim();
          elem = elem.substring(elem.indexOf(mark2) + mark2.length);
          entry.city = elem.trim().substring(0, elem.length - 2);
          break;
        }
        case 'NONE': {
          entry.ourClan = false;

          let mark2 = (elem.indexOf('has left our city of') !== -1) ? 'has left our city of' : 'has been spotted in our city of';
          entry.username = elem.substring(0, elem.indexOf(mark2)).trim();
          if (mark2 === 'has left our city of') entry.inCity = false;
          else if (mark2 === 'has been spotted in our city of') entry.inCity = true;
          entry.clan = null;
          elem = elem.substring(elem.indexOf(mark2) + mark2.length);
          entry.city = elem.trim().substring(0, elem.length - 2);
          break;
        }
      }

      entries.push(entry);
      return entry;
    }), { timestampArr, entries });

    entries = entries.concat(entry);
  }

  await page.waitForSelector('div[align="center"] > div > div > div > div[align="center"] b');
  let currPage = await page.evaluate(() => Number(document.querySelector('span[id^="pagercurrentpage"]').innerText.trim()));
  let totalPages = await page.evaluate(() => Number(document.querySelector('span[id^="pagertotalpages"]').innerText.trim()));

  // keep scraping if there are no old entries to a max of 5 pages
  while (currPage < 5 && currPage < totalPages) {
    await scrapePage();
    currPage = await page.evaluate(() => Number(document.querySelector('span[id^="pagercurrentpage"]').innerText.trim()));
    totalPages = await page.evaluate(() => Number(document.querySelector('span[id^="pagertotalpages"]').innerText.trim()));
    if (gotoNextPage(entries)) {
      await page.click('div[id^=pNext]');
      await page.waitForSelector('div[align="center"] > div > div > div > div[align="center"] b');
      continue;
    }
    break;
  }

  console.log('Scrape finished.');

  insertEntries(entries, bot);
  await page.click('div[id="OGB_logout"]');
  await page.waitForSelector('input[id="btn_ok"]');
  await page.click('input[id="btn_ok"]');
  await page.waitForSelector('input[name="username"]');
  await browser.close();
}