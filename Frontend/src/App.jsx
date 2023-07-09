import { useState, useEffect } from "react";
import "./App.css";

function getTodo() {
  return fetch("http://localhost:3000/todos/", { method: "GET" })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

function postTodo(title, description) {
  const todo = { title, description };

  return fetch("http://localhost:3000/todos/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Todo posted:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error posting todo:", error);
    });
}

function deleteTodo(id) {
  return fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        console.log("Todo deleted");
        return true;
      } else {
        console.error("Failed to delete todo");
        return false;
      }
    })
    .catch((error) => {
      console.error("Error deleting todo:", error);
      return false;
    });
}

function InitialInput({ onTodoSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    onTodoSubmit(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <div>
      <b>Title</b>
      <br />
      <input type="text" value={title} onChange={handleTitleChange} />
      <br />
      <b>Description</b>
      <br />
      <input
        type="text"
        value={description}
        onChange={handleDescriptionChange}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodo()
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  const handleTodoSubmit = (title, description) => {
    postTodo(title, description)
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id)
      .then((success) => {
        if (success) {
          const updatedTodos = todos.filter((todo) => todo.id !== id);
          setTodos(updatedTodos);
        }
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  return (
    <div>
      <InitialInput onTodoSubmit={handleTodoSubmit} />
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>
            {todo.title}
            {todo.description}
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
