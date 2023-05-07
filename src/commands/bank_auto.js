const puppeteer = require('puppeteer');

module.exports = async function (bot, args, channel, inDashboard) {
  if (inDashboard) return;
  if (!args.length) return channel.send(`Please provide an argument.`);
  if (isNaN(args[0])) return channel.send(`Argument must be a number between 1 and 600 (seconds).`);
  args[0] = Math.floor(args[0]);
  if (args[0] > 600 || args[0] <= '0') return channel.send(`Argument must be a number between 1 and 600 (seconds).`);

  channel.send(`Bank set to automatically close in ${args[0]} seconds.`);

  setTimeout(async () => {
    channel.send(`Automatically closing bank...`);
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
    await page.waitForSelector('td[id^=menu_td_0] tr:nth-child(2) td:nth-child(2) li:nth-child(2)');
    await page.waitForSelector('tr[class="overview_back"]');
    await page.click('td[id^="menu_td_0"] tr:nth-child(2) td:nth-child(2) li:nth-child(2)');
    await page.waitForSelector('div[id^="Form"]');

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

    channel.send(`Bank has been automatically closed after ${args[0]} seconds!`);
  }, args[0] * 1000)

};