const express = require("express")
const User = require("./User")
const { Op } = require("sequelize")
const bcrypt = require("bcryptjs")
const router = express.Router()


router.get("/users/create", (request, response) => {
    response.render("admin/users/create_user")
})

router.post("/user/save", (request, response) => {
    var username = request.body.name
    var email = request.body.email
    var password = request.body.password
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if(user != undefined) {
            response.redirect("/users/create")
        }
        else 
        {
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)
            User.create({
                username: username,
                email: email,
                password: hash
            }).then(() => {
                response.redirect("/")
            }).catch((err) => {
                response.redirect("/users/create")
            })
        }
    }).catch()
})

module.exports = router
