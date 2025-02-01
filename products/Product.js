const sequelize = require("sequelize")
const connection = require("../database/connection")


const Product = connection.define('products', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    price: {
        type: sequelize.FLOAT,
        allowNull: false
    },
    priority: {
        type: sequelize.STRING,
        allowNull: false
    },
    finished: {
        type: sequelize.BOOLEAN,
        allowNull: false
    },
    date: {
        type: sequelize.DATEONLY,  // Apenas data sem hora
        allowNull: false
    }
})

module.exports = Product
