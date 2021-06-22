const db = require('../db');
const {timesCampeonato, timesCopa} = require('../controllers/establishingTeams');

async function buscarTimes() {
    const timesDeCampeonato = await timesCampeonato();
    const timesDeCopas = await timesCopa();

    todosOsTimes = [...timesDeCampeonato, ...timesDeCopas];
    todosOsTimes = [...new Set(todosOsTimes)];

    console.log(todosOsTimes);
    
    salvarTimes(todosOsTimes);
}
buscarTimes();

function salvarTimes(times){
    for(const time of times){
        db.query('SELECT nome FROM football.times WHERE nome = ?', [time], 
            function (err, result){
                if(result.length == 0){
                    db.query('INSERT INTO football.times (nome) values (?)', [time], 
                        function (err, result){
                            console.log('err', err);
                            console.log('result', result);
                        }
                    )
                }
            }
        )
    }
}
