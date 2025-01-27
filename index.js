const connection = require("./database/connection")
const Express = require("express")
const body_parser = require("body-parser")
const path = require("path");
const user_controller = require("./users/users_controller")


const app = Express()



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(Express.static('public'))

app.use(body_parser.urlencoded({extended: false}))
app.use(body_parser.json())


connection.authenticate().then(() => {
    console.log("conexão feito com sucesso.")
}).catch((err) => {
    console.log("erro ao conectar com o banco" + err)
})


app.use("/", user_controller)

app.get("/", (request, response) => {
    response.send("Servidor Online.")
})


app.listen(9000, () => {
    console.log("App rodando.")
})