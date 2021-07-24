const db = require("typeorm");

//Método para descobrir os times a serem procurados. Precisa realizar dois tipos de consultas e depois somar tudo em um array. 
//Os dados trazidos de tabelas capturadas de copa/campeonato serão diferentes. 

const establishingTeams = async () => {
    arrayDeTimes = [];
    classificacao = [];

    await db.getConnection()
    .createQueryBuilder()
    .select("classificacao")
    .from("campeonato")
    .where("type = :type", {type: "campeonato"})
    .execute()
    .then(result => {
        result.map(item => {
            teamsParsed = Object.entries(JSON.parse(item.classificacao));
            teamsParsed.map(team => classificacao.push(team[1].time));
        })
        return classificacao;
    })
    .catch(error => console.log(error));

    arrayDeTimes = [...new Set(classificacao)];

    return arrayDeTimes;
}

const gatheringTeamsCups = async () => {
    // let arrayDeTimes = timesDosCampeonatos; 
    let arrayTimesCopa = [];
    let classificacao = [];
    //Procurar times de Copas para reunir com os times de campeonatos já recebido. 
    
    await db.getConnection().createQueryBuilder()
    .select("classificacao")
    .from("campeonato")
    .where("type = :type", {type: "copa"})
    .execute()
    .then(result => {
        result.map(item => {
            teamsParsed = JSON.parse(item.classificacao);
            teamsParsed.map(teamGroup=>{
                classificacao.push(teamGroup.map(team => team.club));
            });
        })
    })
    .catch(errors => console.log(errors));

    classificacao.forEach(group => {
        group.map(item => arrayTimesCopa.push(item));
    });
   
    arrayTimesCopa = [...new Set(arrayTimesCopa)];
    return arrayTimesCopa
}

module.exports = {
    timesCampeonato: establishingTeams,
    timesCopa: gatheringTeamsCups
}