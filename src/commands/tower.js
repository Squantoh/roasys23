const puppeteer = require('puppeteer');

module.exports = async function (bot, args, channel, inDashboard) {
  if (inDashboard) return;
  if (!args.length) return channel.send(`Please provide an argument.`);
  if (args[0] !== 'on' && args[0] !== 'off') return channel.send(`Please provide an argument of "on" or "off".`);
  
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
  await page.waitForSelector('td[id^=menu_td_0] tr:nth-child(2) td:nth-child(2) li:nth-child(8)');
  await page.waitForSelector('tr[class="overview_back"]');
  await page.click('td[id^="menu_td_0"] tr:nth-child(2) td:nth-child(2) li:nth-child(8)');
  await page.waitForSelector('div[id^="Form"]');

  if (args[0] == 'on')
    await page.click('div[id^="radioButtonGroup"] div:nth-child(1) > div > div[class^="jquery-radiobutton"]');
  else if (args[0] == 'off')
    await page.click('div[id^="radioButtonGroup"] div:nth-child(5) > div > div[class^="jquery-radiobutton"]');

  await page.click('input[id^="formButton"]');
  await page.waitForSelector('input[id="btn_msg"]');
  await page.click('input[id="btn_msg"]');

  await page.click('div[id="OGB_logout"]');
  await page.waitForSelector('input[id="btn_ok"]');
  await page.waitFor(300);
  await page.click('input[id="btn_ok"]');
  await page.waitForSelector('input[name="username"]');
  await browser.close();

  if (args[0] === 'on')
    channel.send(`Successfully set guard policy to: "kill all but allies"!`);
  else 
    channel.send(`Successfully set guard policy to: "never attack anyone"!`);
};