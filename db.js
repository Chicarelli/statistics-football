const typeORM = require('typeorm');

const connection = async () => {
    return await typeORM.createConnection();
} 

module.exports = connection;