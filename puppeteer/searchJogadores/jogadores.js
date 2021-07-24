const puppeteer = require("puppeteer");

async function findPlayers(time = 'Palmeiras') {
  try{
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null
    });

    const page = await browser.newPage();
    await page.goto('https://google.com');
    await page.waitForSelector(`input[type="text"]`)
    await page.click(`input[type="text"]`);

    await page.keyboard.type(time + " jogadores",{delay: 100});
    await page.keyboard.press("Enter");

    await page.waitForSelector('.ct5Ked');
    const players = await page.$$eval(".ct5Ked", playerss => {
      const arrayPlayers = []
      playerss.map(playerName => arrayPlayers.push(playerName.ariaLabel));

      return arrayPlayers;
    });
    await browser.close();
    return players;
  
  } catch(error){
   await broser.close();
   return error;
  }
}

module.exports = findPlayers;