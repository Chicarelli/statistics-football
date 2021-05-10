const puppeteer = require('puppeteer');

 async function campeonato(nomeDoCampeonato) {
   try{
  const browser = await puppeteer.launch({
      headless:true,
      defaultViewport: null
  });
  const page = await browser.newPage();

  await page.goto('https://google.com');
  await page.waitForSelector(`input[type="text"]`)
  await page.click(`input[type="text"]`);

  //Define qual campeonato será buscado no google. 
  await page.keyboard.type(nomeDoCampeonato, {delay: 100}); 
  await page.keyboard.press('Enter');
  await page.waitForSelector(`#sports-app > div > div:nth-child(2) > div > div > div > ol > li:nth-child(3)`);
  const realNome = await page.$eval("#sports-app > div > div.imso-loa.imso-lhof.QMSMXe.Wrsj9b > div > div > div.GLbw8e.mfMhoc.imso-ani > div > div.S9Uogc > div.ofy7ae", element => element.textContent);
 
  // -------------------------------------------------------COMENTARIO COMEÇA AQUI
  await page.click(`#sports-app > div > div:nth-child(2) > div > div > div > ol > li:nth-child(3)`);

  //PRIMEIRO PASSO, É IMPORTANTE VER SE O CAMPEONATO TEM FASE DE GRUPOS OU NÃO. - A partir daqui segue-se diversas lógicas mais pra frente.   
  await page.waitForSelector(".Jzru1c"); //SELETOR DA TABELA.
  const tabelas = await page.$$eval(".Jzru1c", element => element.map(option => option.textContent));
  // console.log(tabelas.length); //Caso não haja tabela de grupo, o retorno será apenas 1. S ou mais, será por fase de grupos e existe mais de uma tabela. A regra então, vira outra. 


  //Independente do resultado do tamanho de número de tabelas, este grupo de pesquisas pega todos os dados e transforma numa tabela única, porém não pega jogos de fases que não sejam de grupo
  //(Quarta de final -- semi e por ai vai) 
  const times = await page.$$eval(".imso-loa.imso-hov > td:nth-child(3)", element => element.map(time => time.textContent));
  const pontos = await page.$$eval(".imso-loa.imso-hov > td:nth-child(4)", element => element.map(pontos => pontos.textContent));
  const numeroDeJogos = await page.$$eval(".imso-loa.imso-hov > td:nth-child(5)", element => element.map(partida => partida.textContent));
  const vitorias = await page.$$eval(".imso-loa.imso-hov > td:nth-child(6)", element => element.map(vitoria => vitoria.textContent));
  const empates = await page.$$eval(".imso-loa.imso-hov > td:nth-child(7)", element => element.map(empate => empate.textContent));
  const derrotas = await page.$$eval(".imso-loa.imso-hov > td:nth-child(8)", element => element.map(derrota => derrota.textContent));
  const golsFeitos = await page.$$eval(".imso-loa.imso-hov > td:nth-child(9)", element => element.map(golFeito => golFeito.textContent));
  const golsTomados = await page.$$eval(".imso-loa.imso-hov > td:nth-child(10)", element => element.map(golTomado => golTomado.textContent));
  const saldoGols = await page.$$eval(".imso-loa.imso-hov > td:nth-child(11)", element => element.map(saldoGol => saldoGol.textContent));

  var tabela = {};
  tabela.title = realNome; 
  tabela.classificacao = {};
  
  times.forEach((time, indice ) => {
      tabela.classificacao[indice] = {
        "time": time,
        "pontos": pontos[indice],
        "pj" : numeroDeJogos[indice],
        "vitorias": vitorias[indice],
        "empates": empates[indice],
        "derrotas": derrotas[indice],
        "golsFeitos": golsFeitos[indice],
        "golsTomados": golsTomados[indice],
        "saldoGols": saldoGols[indice],
    };
  });

  await browser.close();
  //Pega todos os times naquele campeonato
  // const times = await page.$$eval(".imso-loa.imso-hov > td:nth-child(3) > div > div > span", element => element.map(option => option.textContent));
  //td:nth-child(3) - Nome do time
  // td: nth-child(4) - pontos
  //td: nth-child(5) - Partidas Jogadas
  //td: nth-child(6) - Vitorias
  //td: nth-child(7) - Empates
  //td: nth-child(8) - Derrotas
  //td: nth-child(9) - Gols Feitos
  //td: nth-child(10) - Gols tomados
  //td: nth-child(11) - Saldo de gols

  //Para tabelas de fase de grupos, tem que pegar por grupo, indo do 2 até 5 (para grupos de 4 times. )
  //#liveresults-sports-immersive__league-fullpage > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div.tb_c.immersive-container.tb_stc > div > div > div > div.ohxm1 > div > div > div > div > div > div:nth-child(2) > div > table > tbody > tr:nth-child(4) 
  // console.log(times)

  // const time = await page.$eval(".imso-loa.imso-hov:nth-child(2) > td:nth-child(3) > div > div > span", element => element.textContent);
  // console.log(time)
  return tabela; 
}
catch(error){
  await browser.close();
  return error
}
}


module.exports = campeonato;