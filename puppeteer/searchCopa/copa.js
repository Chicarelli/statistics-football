const puppeteer = require('puppeteer');

async function copa(nomeDaCopa) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null
    });
    const page = await browser.newPage();

    await page.goto('https://google.com');
    await page.waitForSelector(`input[type="text"]`)
    await page.click(`input[type="text"]`);

    //Define qual campeonato será buscado no google. 
    await page.keyboard.type(nomeDaCopa, { delay: 100 });
    await page.keyboard.press('Enter');
    await page.waitForSelector(`#sports-app > div > div:nth-child(2) > div > div > div > ol > li:nth-child(3)`);
    
    // -------------------------------------------------------COMENTARIO COMEÇA AQUI
    await page.click(`#sports-app > div > div:nth-child(2) > div > div > div > ol > li:nth-child(3)`);

    //PRIMEIRO PASSO, É IMPORTANTE VER SE O CAMPEONATO TEM FASE DE GRUPOS OU NÃO. - A partir daqui segue-se diversas lógicas mais pra frente.   
    await page.waitForSelector(".Jzru1c"); //SELETOR DA TABELA.
    var groupzao = {};
    groupzao.classificacao = await page.$$eval(".Jzru1c", (tabelas) => tabelas.map(tabela => {
      let insideGroup = [];
      tabela.firstChild.childNodes.forEach(group => {
        if(group.childNodes.length >= 12){
          insideGroup.push({
            "position": group.childNodes[1].textContent,
            "club": group.childNodes[2].textContent,
            "pontos": group.childNodes[3].textContent,
            "pj": group.childNodes[4].textContent,
            "vitorias": group.childNodes[5].textContent,
            "empates": group.childNodes[6].textContent,
            "derrotas": group.childNodes[7].textContent,
            "golsFeitos": group.childNodes[8].textContent,
            "golsTomados": group.childNodes[9].textContent,
            "saldoGols": group.childNodes[10].textContent,
          });
        }
      });

      return insideGroup;
    
    }));
    const title = await page.$eval(".ofy7ae", title => title.textContent);
    groupzao.title = title;
    await browser.close();
    return groupzao;
  }
  catch (error) {
    await browser.close();
    return error
  }
}


module.exports = copa;