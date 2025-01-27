const Sequelise = require("sequelize")

const connection = new Sequelise('Gerenciador_financeiro', 'root', '12345678', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
})

module.exports = connection
