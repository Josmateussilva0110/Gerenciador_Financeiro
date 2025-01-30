const express = require("express")
const Product = require("./Product")
const { Op } = require("sequelize")
const bcrypt = require("bcryptjs")
const router = express.Router()

router.get("/product/create", (request, response) => {
    response.send("rota de cadastro de produto.")
})


module.exports = router
