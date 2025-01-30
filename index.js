const connection = require("./database/connection")
const Express = require("express")
const body_parser = require("body-parser")
const path = require("path");
const session = require("express-session")
const user_controller = require("./users/users_controller")
const auth = require("./middlewares/auth")


const app = Express()



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(Express.static('public'))


app.use(session({
    secret: "4002-8922",
    cookie: {maxAge: 5000} // expira em 2 horas
}))



app.use(body_parser.urlencoded({extended: false}))
app.use(body_parser.json())


connection.authenticate().then(() => {
    console.log("conexão feito com sucesso.")
}).catch((err) => {
    console.log("erro ao conectar com o banco" + err)
})


app.use("/", user_controller)

app.get("/", (request, response) => {
    response.render("home")
})


app.listen(9000, () => {
    console.log("App rodando.")
})