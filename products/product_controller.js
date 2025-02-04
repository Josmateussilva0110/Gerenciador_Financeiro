const express = require("express")
const Product = require("./Product")
const { Op } = require("sequelize")
const bcrypt = require("bcryptjs")
const router = express.Router()
const auth = require("../middlewares/auth")

router.get("/products", auth, (request, response) => {
    Product.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(products => {
        response.render("home", {products: products, user: request.session.user})
    })
})

router.get("/product/create", (request, response) => {
    response.render("admin/products/create_product", {user: request.session.user})
})

router.post("/product/save", (request, response) => {
    var name = request.body.name
    var price = request.body.price
    var priority = request.body.priority 
    var finished = request.body.finished
    var date = request.body.date
    Product.findOne({
        where: {
            name: name
        }
    }).then(product => {
        if(product != undefined) {
            response.redirect("/product/create")
        }
        else {
            Product.create({
                name: name,
                price: price,
                priority: priority,
                finished: finished,
                date: date
            }).then(() => {
                response.redirect("/products")
            }).catch((err) => {
                response.redirect("/product/create")
            })
        }
    }).catch((err) => {
        response.redirect("/product/create")
    })
})

router.get("/product/edit/:id", (request, response) => {
    var id = request.params.id
    Product.findOne({
        where: {
            id: id
        }
    }).then(product => {
        response.render("admin/products/detail_product", {product: product, user: request.session.user})
    })
})

module.exports = router
