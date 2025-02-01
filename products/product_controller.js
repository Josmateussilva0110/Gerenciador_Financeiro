const express = require("express")
const Product = require("./Product")
const { Op } = require("sequelize")
const bcrypt = require("bcryptjs")
const router = express.Router()

router.get("/product/create", (request, response) => {
    response.render("admin/products/create_product")
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
                response.redirect("/")
            }).catch((err) => {
                response.redirect("/product/create")
            })
        }
    }).catch((err) => {
        response.redirect("/product/create")
    })
})


module.exports = router
