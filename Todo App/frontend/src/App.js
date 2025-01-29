import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'

function App() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [todos, setTodos] = useState([]);


  const fetchTodos = async () => {

    try {
      const response = await fetch(`${apiUrl}todoRoutes/getalltodos`, { method: "GET" });
      const data = await response.json();
      setTodos(data.todos);
    }
    catch (error) {
      console.log(error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${apiUrl}todoRoutes/deletetodo/${id}`, { method: "DELETE" })
      fetchTodos();
    }
    catch (error) {
      console.log(error)
    }
  }

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    completed: false
  })

  const createTodo = async (e) => {
    if (newTodo.title === "") {
      alert("Please enter a title")
    }

    try {
      const response = await fetch(`${apiUrl}todoRoutes/createtodo`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      })

      const data = await response.json()
      console.log(data)
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [])

  return (

    <div className="App">
      <h1>Todo App</h1>
      <hr /><br />
      {Array.isArray(todos) && todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        Array.isArray(todos) &&
        todos.map((todo) => (
          <div key={todo._id}>
            <h2>{todo.title}</h2>
            <p>{todo.description}</p>
            {todo.completed ? 'Completed' : 'Not Completed'}
            <br />
            <br />
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            <br />
          </div>
        ))
      )}
      <br />
      <br />
      <br />
      <br />

      <h1>Create Todo</h1>
      <form>
        <input type="text" placeholder='Title'
          onChange={(e) => setNewTodo({
            ...newTodo,
            title: e.target.value
          })}
        />
        <br />
        <input type="text" placeholder='Description'
          onChange={(e) => setNewTodo({
            ...newTodo,
            description: e.target.value
          })}
        />
        <br />
        <button onClick={createTodo}>Create Todo</button>
      </form>
    </div>
  );
}

export default App;
