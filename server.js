const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectId;
// const TODO = require("./models/Todo")

dotenv.config();
const app = express();
const PORT = 3000;
const TEMPLATES_DIR = __dirname + "/templates";

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {
  console.log("Database connected !");

  const db = client.db("crud-todos");
  const todosCollection = db.collection("todos");

  app.get("/", async (request, response) => {
    todosCollection
      .find()
      .toArray()
      .then((result) => {
        response.render("index.ejs", { todos: result });
      })
      .catch((err) => console.log(err));
  });
  app.get("/add", (request, response) => {
    response.render("addTodo.ejs");
  });

  app.post("/add", async (request, response) => {
    // newTodo = {id: DATA.length + 1, title: request.body.title, description: request.body.title};
    todosCollection
      .insertOne(request.body)
      .then((result) => response.redirect("/"))
      .catch((err) => {
        console.log(err);
      });
    // DATA.push(newTodo)
    // response.redirect("/")
  });

  
app.get("/delete", async (request, response) => {
    var id = request.query.id;
    if (id) {
      // var todo = getTodo(id)
      console.log("Dasd");

        todosCollection.deleteOne({ _id: new ObjectID(id.toString()) })
        .then((result) => {
            if (result.deletedCount == 0){
                return response.json("No todo to delete");
            }
            else {
                response.redirect("/")
            }
        })
        .catch(err => console.log(err))
      // DATA = DATA.filter(todo => todo.id != id)
    }
  });

  
app.get("/update", (request, response) => {
    var id = request.query.id;
    if (id) {
      // var todo = getTodo(id)
      todosCollection.findOne({_id : new ObjectID(id)})
      .then((result) => {
        response.render("updateTodo.ejs", { todo:result });

      })
      .catch(err => {console.log(err)
        response.redirect("/");
    
    })
    }
  });
  

  app.post("/update", async (request, response) => {
    // var todo = getTodo(request.body.id);

    todosCollection.findOneAndUpdate({_id: new ObjectID(request.body.id)}, {
        $set: {
            title: request.body.title,
            description: request.body.description,
        }
    }).then(result => {

    response.redirect("/");
    }).catch(err => console.log(err))
    // todo.title = request.body.title
    // todo.description = request.body.description
  });
  
  app.get("/todo", (request, response) => {
    var id = request.query.id;
    if (id) {
      todosCollection.findOne({_id : new ObjectID(id)})
      .then((result) => {
        response.render("viewTodo.ejs", { todo:result });

      })
      .catch(err => {console.log(err)
        response.redirect("/");
    
    })
    }
  });
  


});

let DATA = [
  { id: 1, title: "Task 1", description: "Do Task" },
  { id: 2, title: "Task 2", description: "Do Task" },
  { id: 3, title: "Task 3", description: "Do Task" },
];

const getTodo = (id) => {
  var todoToUpdate = {};
  DATA.forEach((todo) => {
    if (todo.id == id) {
      todoToUpdate = todo;
    }
  });
  return todoToUpdate;
};



app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});
