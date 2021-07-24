const db = require('typeorm');
const campeonato = require('../puppeteer/searchCampeonatos/campeonato');
const campeonatosBuscados = ['Campeonato Francês', 'Campeonato Brasileiro', 'Campeonato Alemão', 'Campeonato Italiano', 'Campeonato Holandes', 'Campeonato Português', 'Campeonato Inglês'];

async function searchCampeonato() {
    for (const camp of campeonatosBuscados) {
        await campeonato(camp).then(response => {

            db.getConnection()
            .createQueryBuilder()
            .select("*")
            .from("campeonato")
            .where('campeonato.nome = :campeonato_nome', {campeonato_nome: response.title}).execute()
            .then(async data => {
                if(data.length == 0 ){
                    await db.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into("campeonato")
                    .values([
                        {
                            nome: response.title,
                            classificacao: JSON.stringify(response.classificacao),
                        }
                    ]).execute();
                } else {
                    await db.getConnection()
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
                console.log('Erro no campeonato:', camp, 'Tipo de erro: ', error);
            })   
        })
        .catch(error => {
            console.log('Erro', error);
        })
    }
};

module.exports = searchCampeonato; 