
// /**
//  * TODO:
//  * 1. styles
//  * 2. save changes button----------------------------
//  * 3. delete button----------------------------------
//  * 4. completed--------------------------------------
//  * 5. filter-----------------------------------------
//  * 6. search-----------------------------------------
//  * 7. header?
//  * 8. add--------------------------------------------
//  * 9. save button grayed ??
//  */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Todos() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [nextId, setNextId] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [search, setSearch] = useState("");

  const getTodos = () => {
    fetch(`http://localhost:3000/todos?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setTodos(data));

    fetch(`http://localhost:3000/todos`)
      .then((res) => res.json())
      .then((data) =>
        setNextId((Number(data[data.length - 1].id) + 1).toString())
      );
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const newTodo = {
      userId,
      id: nextId,
      title: newTitle,
      completed: false,
    };

    await fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    getTodos();
    setNewTitle("");
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
    getTodos();
  };

  const handleSave = async (id) => {
    const toSave = todos.find((todo) => todo.id === id);
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(toSave),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  const handleToggle = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleUpdate = (id, newTitle) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    );
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (!search.trim()) return true;
      return (
        todo.id.toString().includes(search) ||
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        (search.toLowerCase() === "completed" && todo.completed) ||
        (search.toLowerCase() === "not completed" && !todo.completed)
      );
    })
    .sort((a, b) => {
      if (sortBy === "id") return a.id - b.id;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "completed")
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
    });

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Segoe UI', sans-serif",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      {/* Header with Home button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#2c3e50", margin: 0 }}>
          📝 Todos
        </h1>
        <button
          onClick={() => navigate(`/home/users/${userId}`)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2c3e50",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Home
        </button>
      </div>

      {/* Input for new todo */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Enter new todo..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "10px 16px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* Search and sort controls */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "16px",
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "16px",
          }}
        >
          <option value="id">Sort by ID</option>
          <option value="title">Sort by Title</option>
          <option value="completed">Sort by Status</option>
        </select>
      </div>

      {/* Todo list */}
      <div>
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            style={{
              background: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
                style={{ transform: "scale(1.2)", cursor: "pointer" }}
              />
              <input
                type="text"
                value={todo.title}
                onChange={(e) => handleUpdate(todo.id, e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  fontSize: "16px",
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "#999" }}>#{todo.id}</span>
              <button
                onClick={() => handleSave(todo.id)}
                style={{
                  backgroundColor: "#2ecc71",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
