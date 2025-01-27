const express = require("express")
const User = require("./User")
const { Op } = require("sequelize");
const router = express.Router()


router.get("/users/create", (request, response) => {
    response.render("admin/users/create_user")
})

module.exports = router
