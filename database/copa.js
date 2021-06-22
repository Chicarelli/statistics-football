const db = require('../db');
const copa = require('../puppeteer/searchCopa/copa');
const copasBuscadas = ['Libertadores', 'Paulistão', 'Champions League'];
// const copasBuscadas = ['Libertadores'];

async function searchCopa(){
    for (const cup of copasBuscadas){
        await copa(cup).then(response => {
            db.query('SELECT nome, id_campeonato FROM football.campeonato WHERE nome = ?', [response.title],
                function (err, result) {
                    if (result.length == 0) {
                        //Insert Into tabela. 
                        db.query('INSERT INTO football.campeonato (nome, classificacao) VALUES (?, ?)', [response.title, JSON.stringify(response.classificacao)],
                            function (err, result) {
                                console.log('erro:', err);
                                console.log('result:', result)
                            })
                    } else {
                        db.query('UPDATE football.campeonato SET classificacao = ?, updated_at = CURRENT_TIMESTAMP WHERE nome = ?', [JSON.stringify(response.classificacao), response.title],
                            function (err, result) {
                                console.log('erro: ', err);
                                console.log('result: ', result);
                            }
                        )
                    }
                }
            )
        })
        .catch(error => {
            console.log('Erro no campeonato: ', cup);
        })
    }
}
searchCopa();