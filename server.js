const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const PORT = 3000
const TEMPLATES_DIR = __dirname + "/templates"

app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


let DATA = [
    {id: 1, title: "Task 1", description: "Do Task"},
    {id: 2, title: "Task 2", description: "Do Task"},
    {id: 3, title: "Task 3", description: "Do Task"},
]

app.get("/", (request, response) => {
    response.render("index.ejs", {todos: DATA})
})

app.get("/add", (request, response) => {
    response.render("addTodo.ejs")
})

app.post("/add", (request, response) => {
    newTodo = {id: DATA.length + 1, title: request.body.title, description: request.body.title};
    DATA.push(newTodo)
    response.redirect("/")
})

const getTodo = (id) => {
    var todoToUpdate = {}
    DATA.forEach((todo) => {
        if (todo.id == id){
            todoToUpdate = todo
        }
    });
    return todoToUpdate
}

app.get("/todo", (request, response) => {
    var id = request.query.id
    if (id) {
        var todo = getTodo(id)
        response.render("viewTodo.ejs", {todo})
    }
    response.redirect("/")
})

app.get("/update", (request, response) => {
    var id = request.query.id
    if (id) {
        var todo = getTodo(id)
        response.render("updateTodo.ejs", {todo})
    }
    response.redirect("/")
})

app.post("/update", (request, response) => {
    var todo = getTodo(request.body.id)
    todo.title = request.body.title
    todo.description = request.body.description
    response.redirect("/")
})

app.get("/delete", (request, response) => {
    var id = request.query.id
    if (id) {
        var todo = getTodo(id)
        DATA = DATA.filter(todo => todo.id != id)
        response.redirect("/")
    }
})

app.listen(PORT, () => {
    console.log(`Listening at port: ${PORT}`)
})