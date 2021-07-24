const copa = require('../puppeteer/searchCopa/copa');
// const copasBuscadas = ['Libertadores', 'Paulistão', 'Champions League'];
const db = require('typeorm');
const copasBuscadas = ['Libertadores'];

async function searchCopa(){
    for (const cup of copasBuscadas){
        await copa(cup).then(async response => {
            db.getConnection()
            .createQueryBuilder()
            .select("*")
            .from("campeonato")
            .where("nome = :nome", {nome: response.title})
            .execute()
            .then(async data => {
                if(data.length == 0){
                    db.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into("campeonato")
                    .values([
                        {
                            nome: response.title,
                            classificacao: JSON.stringify(response.classificacao)
                        }
                    ])
                    .execute();
                } else {
                    db.getConnection()
                    .createQueryBuilder()
                    .update("campeonato")
                    .set({
                        classificacao: JSON.stringify(response.classificacao),
                        updated_at: new Date()
                    })
                    .where("nome = :nome", {nome: response.title})
                    .execute();
                }
            })
            .catch(error => {
                console.log('Ih, errinho!', error);
            })
        })
        .catch(error => {
            console.log('Erro no campeonato: ', cup);
        })
    }
}
searchCopa();