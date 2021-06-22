const db = require('../db');

//Método para descobrir os times a serem procurados. Precisa realizar dois tipos de consultas e depois somar tudo em um array. 
//Os dados trazidos de tabelas capturadas de copa/campeonato serão diferentes. 

const establishingTeams = async () => {
    arrayDeTimes = [];
    classificacao = [];

    var resultad = await db.promise().query('SELECT classificacao FROM football.campeonato WHERE type = "campeonato"')
        .then(result => {
            result.map(item => {
                item.map(i => {
                    if (i.classificacao) {
                        classificacao.push(JSON.parse(i.classificacao));
                    }
                })
            })
            return classificacao
        }
        )
        .catch(error => console.log(error))
    classificacao.forEach(item => {
        let timesClassificacao = Object.values(item);
        timesClassificacao.forEach(item => arrayDeTimes.push(item.time));
    });

    arrayDeTimes = [...new Set(arrayDeTimes)];

    return arrayDeTimes;
}

const gatheringTeamsCups = async () => {
    // let arrayDeTimes = timesDosCampeonatos; 
    let arrayTimesCopa = [];
    let classificacao = [];
    //Procurar times de Copas para reunir com os times de campeonatos já recebido. 

    await db.promise().query('SELECT classificacao FROM football.campeonato WHERE type = "copa"')
        .then(result => {
            result.map(item => {
                item.map(i => {
                    if (i.classificacao) {
                        classificacao.push(JSON.parse(i.classificacao));
                    }
                })
            }

                // copas = result.map(item => JSON.parse(item.classificacao));
            )
        })
        .catch(errors => console.log(errors));

    
        classificacao.forEach(vettor => {
            vettor.forEach(vetor => {
                vetor.forEach(copa => {
                    arrayTimesCopa.push(copa.club);
                })
            })
        })
   
    arrayTimesCopa = [...new Set(arrayTimesCopa)];
    return arrayTimesCopa
}

// const juntandoArrays = (arrayCampeonato, arrayCopa) => {
//     let newArray = [...arrayCampeonato, ...arrayCopa];
//     let arraySemDuplicatas = [...new Set(newArray)];

//     return arraySemDuplicatas.sort();
// }


module.exports = {
    timesCampeonato: establishingTeams,
    timesCopa: gatheringTeamsCups
}