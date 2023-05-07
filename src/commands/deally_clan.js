const puppeteer = require('puppeteer');

module.exports = async function (bot, args, channel, inDashboard) {
  if (inDashboard) return;
  if (!args.length) return channel.send(`Please provide an argument.`);
  
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

  let validArgs = [], invalidArgs = [], notUniqueArgs = [], unableToArgs = [], alreadyArgs = [];

  for (let i = 0; i < args.length; i++) {
    await page.waitFor(500);
    await page.click('div[id^="newtDiv"] > div > div:nth-child(3)');
    await page.waitForSelector('th[abbr="ClanName"] div[id^="thdiv"]');
    await page.click('div[class^="pSearch pButton"]');
    await page.waitForSelector('div[class^="sDiv2"]');
    await page.type('input[name="q"]', args[i])
    await page.click('div[class^="grid_search"]');
    await page.waitForFunction(`$('span[class^="pPageStat"]')[1].innerText !== "Processing, please wait ..."`);
    let result = await page.evaluate(() => $('span[class^="pPageStat"]')[1].innerText);

    if (result === 'No clan') {
      invalidArgs.push(args[i]);
      await page.click('input[id^="WizardCancelButton"]');
    } else if (Number(result.split(' ')[5]) > 1) {
      notUniqueArgs.push(args[i]);
      await page.click('input[id^="WizardCancelButton"]');
    } else {
      let clanName = await page.evaluate(() =>$('div[id^="WizardPagePlugin"] div[id^="gamepanel"] table[id^="GridTable"] td:first-child > div > div')[0].innerText);
      if (clanName !== args[i]) clanName = `${args[i]} (${clanName})`;

      await page.click('div[id^="WizardPagePlugin"] div[id^="gamepanel"] table[id^="GridTable"] td:first-child');
      await page.click('input[id^="WizardNextButton"');
      await page.waitForSelector('div[id^="WizardDataContentTitle1"');
      await page.click('div[id^="radioRowundefined2"] > div:first-child > div:first-child');
      await page.click('input[id^="WizardFinishButton"]');
      await page.click('input[id^="btn_wiz_ok"]');
      await page.waitForSelector('div[id^="WizardPageContentFinalizeData"] > table');

      let resultMsg = await page.evaluate(() => $('div[id^="WizardPageContentFinalizeData"]')[0].innerText);
      console.log(resultMsg, new Date());
      if (resultMsg.includes('You cannot take any political actions')) {
        unableToArgs.push(clanName);
      } else if (resultMsg.includes('is now considered Neutral to us')) {
        validArgs.push(clanName);
      } else {
        alreadyArgs.push(clanName);
      }
      await page.waitForSelector('input[id^="btn_wiz_msg"]');
      await page.click('input[id^="btn_wiz_msg"]');
    }
  }

  await page.click('div[id="OGB_logout"]');
  await page.waitForSelector('input[id="btn_ok"]');
  await page.waitFor(300);
  await page.click('input[id="btn_ok"]');
  await page.waitForSelector('input[name="username"]');
  await browser.close();

  if (validArgs.length) channel.send(`\`${validArgs.join(', ')}\`: have been de-allied!`);
  if (invalidArgs.length) channel.send(`\`${invalidArgs.join(', ')}\`: not valid search name(s).`);
  if (notUniqueArgs.length) channel.send(`\`${notUniqueArgs.join(', ')}\`: not unique search name(s).`);
  if (unableToArgs.length) channel.send(`\`${unableToArgs.join(', ')}\`: unable to be de-allied. Try again later.`);
  if (alreadyArgs.length) channel.send(`\`${alreadyArgs.join(', ')}\`: already de-allied!`);
};