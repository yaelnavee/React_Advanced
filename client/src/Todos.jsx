// import { useParams } from "react-router-dom";
// function Todos() {
//     const { userId } = useParams();

//   return (
//     <>todos will be here</>
//   );
// }

// export default Todos;
import React, { useState } from 'react';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [search, setSearch] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const newTodo = {
      id: Date.now(),
      title: newTitle,
      done: false,
    };
    setTodos([...todos, newTodo]);
    setNewTitle("");
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggle = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
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
        (search.toLowerCase() === "done" && todo.done) ||
        (search.toLowerCase() === "not done" && !todo.done)
      );
    })
    .sort((a, b) => {
      if (sortBy === "id") return a.id - b.id;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "done") return a.done === b.done ? 0 : a.done ? 1 : -1;
    });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Todos</h1>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input
          type="text"
          placeholder="New todo title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={handleAdd} style={{ padding: '8px 12px' }}>Add</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Search by id, title or status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px' }}>
          <option value="id">Sort by ID</option>
          <option value="title">Sort by Title</option>
          <option value="done">Sort by Status</option>
        </select>
      </div>

      <div style={{ marginTop: '20px' }}>
        {filteredTodos.map((todo) => (
          <div key={todo.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                />
                <input
                  type="text"
                  value={todo.title}
                  onChange={(e) => handleUpdate(todo.id, e.target.value)}
                  style={{ flex: 1, padding: '4px' }}
                />
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>ID: {todo.id}</div>
            </div>
            <button onClick={() => handleDelete(todo.id)} style={{ marginLeft: '10px', backgroundColor: '#f44336', color: 'white', padding: '6px 10px', border: 'none', cursor: 'pointer' }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}