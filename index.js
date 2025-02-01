const connection = require("./database/connection")
const Express = require("express")
const body_parser = require("body-parser")
const path = require("path");
const session = require("express-session")
const user_controller = require("./users/users_controller")
const product_controller = require("./products/product_controller")
const product = require("./products/Product")


const app = Express()



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(Express.static('public'))


app.use(session({
    secret: "4002-8922",
    //cookie: {maxAge: 7200000} // expira em 2 horas
    cookie: {maxAge: 20000}
}))



app.use(body_parser.urlencoded({extended: false}))
app.use(body_parser.json())


connection.authenticate().then(() => {
    console.log("conexão feito com sucesso.")
}).catch((err) => {
    console.log("erro ao conectar com o banco" + err)
})


app.use("/", user_controller)
app.use("/", product_controller)

app.get("/", (request, response) => {
    response.send("Inicio")
})


app.listen(9000, () => {
    console.log("App rodando.")
})