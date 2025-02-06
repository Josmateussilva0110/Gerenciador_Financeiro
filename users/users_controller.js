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
    }).catch((err) => {
        response.redirect("/users/create")
    })
})

router.get("/user/login", (request, response) => {
    response.render("admin/users/login_user", { user: null, title: 'Login' })
})

router.post("/user/authenticate", (request, response) => {
    var email = request.body.email
    var password = request.body.password
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if(user == undefined) {
            response.redirect("/users/login")
        }
        else {
            var correct_password = bcrypt.compareSync(password, user.password)
            if(correct_password) {
                request.session.user = {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
                response.redirect("/products")
            }
            else {
                response.redirect("/user/login")
            }
        }
    })
})

router.get("/logout", (request, response) => {
    request.session.user = undefined
    response.redirect("/")
})

module.exports = router
