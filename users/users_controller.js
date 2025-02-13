const express = require("express")
const User = require("./User")
const { Op } = require("sequelize")
const bcrypt = require("bcryptjs")
const router = express.Router()
const flash = require("express-flash")
const validator = require("validator")
const getValueOrDefault = require("../utils/verification")


router.get("/users/create", (request, response) => {
    var username_err = request.flash("username_err")
    var email_err = request.flash("email_err")
    var password_err = request.flash("password_err")
    var username = request.flash("username")
    var email = request.flash("email")
    var password = request.flash("password")
    username_err = getValueOrDefault(username_err, undefined)
    email_err = getValueOrDefault(email_err, undefined)
    password_err = getValueOrDefault(password_err, undefined)

    username = getValueOrDefault(username)
    email = getValueOrDefault(email)
    password = getValueOrDefault(password)
    response.render("admin/users/create_user", {username_err, email_err, password_err, username, email, password})
})



router.post("/user/save", (request, response) => {
    var {username, email, password} = request.body
    var username_err
    var email_err
    var password_err
    if(!validator.isEmail(email))
        email_err = 'Email Invalido!!'
    if(!validator.isAlphanumeric(username) || username.length < 3)
        username_err = 'Nome Invalido!!'
    if(password == "" || password == undefined || password.length < 5)
        password_err = 'Senha Invalida!!'

    if(username_err != undefined || email_err != undefined) {
        request.flash("username_err", username_err)
        request.flash("email_err", email_err)
        request.flash("password_err", password_err)
        request.flash("username", username)
        request.flash("email", email)
        request.flash("password", password)
        response.redirect("/users/create")
    }
    else {
    
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
    }
})



router.get("/user/login", (request, response) => {
    var email_err = request.flash("email_err")
    var password_err = request.flash("password_err")
    var email = request.flash("email")
    var password = request.flash("password")
    email_err = getValueOrDefault(email_err, undefined)
    password_err = getValueOrDefault(password_err, undefined)
    email = getValueOrDefault(email)
    password = getValueOrDefault(password)
    response.render("admin/users/login_user", { user: null, title: 'Login', email_err, password_err, email, password})
})

router.post("/user/authenticate", (request, response) => {
    var email = request.body.email
    var password = request.body.password
    var email_err
    var password_err
    if(!validator.isEmail(email))
        email_err = 'Email Invalido!!'
    if(password == "" || password == undefined || password.length < 5)
        password_err = 'Senha Invalida!!'

    if(password_err != undefined || email_err != undefined) {
        request.flash("email_err", email_err)
        request.flash("password_err", password_err)
        request.flash("email", email)
        request.flash("password", password)
        response.redirect("/user/login")
    }
    else {

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
    }
})

router.get("/logout", (request, response) => {
    request.session.user = undefined
    response.redirect("/")
})


router.get("/user/change-password/:id", (request, response) => {
    var id = request.params.id
    User.findByPk(id).then(user => {
        if(user) {
            response.render("admin/users/new_password", {user: user})
        }
        else  response.redirect("/products")
    }).catch((err) => {
        response.redirect("/products")
    })
})


router.post("/user/password/new/save", async (request, response) => {
    const {id, password, confirm_password, current_password} = request.body

    try {
        const user = await User.findByPk(id)
        if(!user) return response.redirect("/products")
        if(password !== confirm_password) {
            return response.render("admin/users/new_password", {user: user})
        }
        const valid = bcrypt.compareSync(current_password, user.password)
        if(!valid) {
            return response.render("admin/users/new_password", {user: user})
        }
        const salt = bcrypt.genSaltSync(10)
        const hashed_password = bcrypt.hashSync(password, salt)
        await User.update({ password: hashed_password }, { where: { id: id } })
        response.redirect("/products")
    } catch (err) {
        response.render("admin/users/new_password", {user: {id: id}})
    }
})

router.get("/user/profile/:id", (request, response) => {
    var id = request.params.id
    User.findByPk(id).then(user => {
        response.render("admin/users/user_profile", {user: user})
    }).catch((err) => {
        response.redirect("/products")
    })
})

module.exports = router