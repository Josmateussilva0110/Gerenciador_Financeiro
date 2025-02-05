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

router.get("/product/detail/:id", (request, response) => {
    var id = request.params.id
    Product.findOne({
        where: {
            id: id
        }
    }).then(product => {
        response.render("admin/products/detail_product", {product: product, user: request.session.user})
    })
})

router.post("/product/delete", (request, response) => {
    var id = request.body.id
    if(id == undefined)
        response.redirect("/products")
    else {
        if(isNaN(id)) {
            response.redirect("/products")
        }
        else {
            Product.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                response.redirect("/products")
            }).catch((err) => {
                response.redirect("/products")
            })
        }
    }
})

router.get("/product/edit/:id", (request, response) => {
    var id = parseInt(request.params.id) 
    if(isNaN(id)) {
        response.redirect("/products")
    }
    else {
        Product.findByPk(id).then(product => {
            response.render("admin/products/edit_product", {product: product, user: request.session.user})
        }).catch((err) => {
            response.redirect("/products")
        })
    }
})

router.post("/product/update", (request, response) => {
    const { id, name, price, priority, finished, date } = request.body

    Product.update(
        { name, price, priority, finished, date },
        { where: { id } }
    )
    .then(() => response.redirect("/products"))
    .catch(err => response.redirect("/products"))
})


router.get("/products/sim", (request, response) => {
    Product.findAll({
        where: {
            finished: 'Sim'
        }
    }).then(products => {
        response.render("home", {products: products, user: request.session.user})
    })
})

router.get("/products/nao", (request, response) => {
    Product.findAll({
        where: {
            finished: 'Nao'
        }
    }).then(products => {
        response.render("home", {products: products, user: request.session.user})
    })
})

router.get("/products/search", (request, response) => {
    const search_term = request.query.term

    if (!search_term) {
        return response.redirect("/products")
    }

    Product.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${search_term}%` } },
                { price: { [Op.like]: `%${search_term}%` } },
                { priority: { [Op.like]: `%${search_term}%` } },
                { finished: { [Op.like]: `%${search_term}%` } },
                { date: { [Op.like]: `%${search_term}%` } }
            ]
        },
        order: [
            ['id', 'DESC']
        ]
    }).then(products => {
        response.render("home", { products: products, user: request.session.user })
    }).catch(err => {
        console.error(err)
        response.redirect("/products")
    })
})

module.exports = router
