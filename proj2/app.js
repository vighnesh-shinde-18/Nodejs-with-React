const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let todos = [];
let nextId = 1;

app.get("/todos", (req, res) => {
  res.status(200).send(todos);
});

app.post("/todos", (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).send({ message: "Please provide a valid title" });
  }
  const newTodo = { id: nextId++, title, completed: false };
  todos.push(newTodo);
  res.status(201).send(newTodo);
});

app.patch("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((ele) => ele.id == id)
  if (!todo) return res.status(404).send({ message: "Todo not found" });

  todo.completed = !todo.completed;
  res.status(200).send(todo);
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).send({ message: "Todo not found" });

  const deleted = todos.splice(index, 1);
  res.status(200).send({ message: "Deleted", todo: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
