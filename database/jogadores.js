const connection = require('../db');
const db = require("typeorm");
const searchJogadores = require('../puppeteer/searchJogadores/jogadores');

const team = async() => {
  await connection();
  const teamsRecovered = [];
  query = await db.getConnection().createQueryBuilder()
  .select("idtimes, nome")
  .from("times")
  .execute()
  .then(data => {
    data.map(item => {
      teamsRecovered.push({
        id_time: item.idtimes,
        name: item.nome
      })
    })
  })
  .catch(error => {
    console.log(error);
  });
  // console.log(teamsRecovered);
  for (const team of teamsRecovered){
    const playersOfTeam = await searchJogadores(team.name);
    
    await playersOfTeam.forEach(async player => {
      await db.getConnection().createQueryBuilder()
      .select("*")
      .from("jogadores")
      .where("nome = :nome", {nome: player})
      .where("id_time = :idtime", {idtime: team.id_time})
      .execute()
      .then(async result => {
        if(result.length == 0 ){
          await db.getConnection().createQueryBuilder()
          .insert()
          .into("jogadores")
          .values([
            {
              id_time: team.id_time,
              nome: player
            }
          ])
          .execute()
          .catch(error => console.log(error));
        }
      }).catch(error => {
        console.log(error);
      })
    })
  }
}
team();

module.exports = team;