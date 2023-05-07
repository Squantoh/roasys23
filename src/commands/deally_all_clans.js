const puppeteer = require('puppeteer');

module.exports = async function (bot, args, channel, inDashboard) {
  if (inDashboard) return;
  
  channel.send(`Running command...`);

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
  await page.waitForSelector('td[id^=menu_td_0] tr:nth-child(2) td:nth-child(2) li:nth-child(6)');
  await page.waitForSelector('tr[class="overview_back"]');
  await page.click('td[id^="menu_td_0"] tr:nth-child(2) td:nth-child(2) li:nth-child(6)');
  await page.waitForSelector('div[id^="HeaderDiv"]');

  await page.click('div[id^="GridLiveFilterButton"][index="4"]')
  await page.waitForFunction(`$('span[class^="pPageStat"]')[0].innerText !== "Processing, please wait ..."`);

  let result = await page.evaluate(() => $('span[class^="pPageStat"]')[0].innerText);

  if (result.includes('Displaying')) {
    channel.send('All clans have been de-allied.');
  } else {
    channel.send('No clans to de-ally.');
  }

  let resultCount = await page.evaluate(() => $('table[id^="GridTable"] > tbody > tr').length);

  for (let i = 1; i <= resultCount; i++) {
    await page.waitFor(500);
    let affiliation = await page.evaluate((i) => $(`table[id^="GridTable"] > tbody > tr:nth-child(${i}) td:nth-child(2) a`)[0].innerText, i);
    if (affiliation == "allied") {
      await page.click(`table[id^="GridTable"] > tbody > tr:nth-child(${i}) em[class^="slider_left"]`);
      await page.click(`table[id^="GridTable"] > tbody > tr:nth-child(${i}) em[class^="slider_left"]`);
      await page.click('div[id^="newtDiv"] > div > div:nth-child(2)');
      await page.waitForSelector('input[id^="btn_ok"]');
      await page.click('input[id^="btn_ok"]');
      await page.waitForSelector('input[id^="btn_msg"]');
      await page.click('input[id^="btn_msg"]');
    }
  }
    
  await page.click('div[id="OGB_logout"]');
  await page.waitForSelector('input[id="btn_ok"]');
  await page.waitFor(300);
  await page.click('input[id="btn_ok"]');
  await page.waitForSelector('input[name="username"]');
  await browser.close();
};