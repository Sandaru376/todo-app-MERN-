import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // Get all todos
  useEffect(() => {
    axios.get("http://localhost:5000/api/todos")
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add todo
  const addTodo = () => {
    if (!text.trim()) return;
    axios.post("http://localhost:5000/api/todos", { text })
      .then(res => {
        setTodos([...todos, res.data]);
        setText("");
      })
      .catch(err => console.error(err));
  };

  // Toggle complete
  const toggleTodo = (id) => {
    axios.put(`http://localhost:5000/api/todos/${id}`)
      .then(res => {
        setTodos(todos.map(todo => todo._id === id ? res.data : todo));
      })
      .catch(err => console.error(err));
  };

  // Delete todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={styles.container}>
      <h1>Todo List</h1>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add new todo..."
        />
        <button style={styles.button} onClick={addTodo}>Add</button>
      </div>

      {todos.map(todo => (
        <div key={todo._id} style={styles.todoItem}>
          <span
            onClick={() => toggleTodo(todo._id)}
            style={{
              ...styles.todoText,
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "gray" : "black"
            }}
          >
            {todo.text}
          </span>
          <button style={styles.deleteBtn} onClick={() => deleteTodo(todo._id)}>❌</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "50px auto", textAlign: "center" },
  inputContainer: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { flex: 1, padding: "8px" },
  button: { padding: "8px 12px", background: "blue", color: "white", border: "none" },
  todoItem: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  todoText: { cursor: "pointer" },
  deleteBtn: { background: "red", color: "white", border: "none", padding: "5px" }
};
