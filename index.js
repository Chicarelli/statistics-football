const cron = require("node-cron");
const searchCampeonato = require('./database/campeonatos');
const connection = require("./db");
const searchCopa = require('./database/copa');
const teams = require("./database/teams");

(async function () {
    await connection()
    .then(data => console.log('Database connected'))
    .catch(error => console.log('Database error connection.'));
})();

// second (0-59) O exemplo começa daqui minute (0-59), hour(0-23), day of month (1-31), month (1-12 or names), day of week(0-7 os names 0 or 7 are sundays)

//CRONJOB EVERY DAY!
cron.schedule("0 0 */1 * *", () => {
    searchCampeonato();
    searchCopa();
}, {
    timezone: "America/Sao_Paulo"
})

cron.schedule("0 0 * * 6", async () => {
    await teams();
    searchJogadores();
}, {
    timezone: "America/Sao_Paulo"
})

