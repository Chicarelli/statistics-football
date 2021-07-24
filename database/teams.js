const connection = require('../db');
const db = require("typeorm");
const {timesCampeonato, timesCopa} = require('../controllers/establishingTeams');

async function buscarTimes() {

    await connection();

    const timesDeCampeonato = await timesCampeonato();
    const timesDeCopas = await timesCopa();
    // console.log(timesDeCampeonato);

    todosOsTimes = [...timesDeCampeonato, ...timesDeCopas];
    todosOsTimes = [...new Set(todosOsTimes)];
    
    salvarTimes(todosOsTimes);
}
buscarTimes();

async function salvarTimes(times){
    for(const time of times){

        await db.getConnection().createQueryBuilder()
        .select("nome")
        .from("times")
        .where("nome = :nome", {nome: time})
        .execute()
        .then(async result => {
            if(result.lenght == 0){
                await db.getConnection().createQueryBuilder()
                .insert()
                .into("times")
                .values([
                    {nome: time}
                ])
                .execute();
            }
        });
    }
}
