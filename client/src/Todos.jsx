import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './css/Posts.css'; // שימוש באותו CSS של הפוסטים

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
      
      const searchLower = search.toLowerCase();
      
      return (
        todo.id.toString().includes(search) ||
        todo.title.toLowerCase().includes(searchLower) ||
        // חיפוש באנגלית
        (searchLower === "completed" && todo.completed) ||
        (searchLower === "not completed" && !todo.completed) ||
        // חיפוש בעברית
        (searchLower === "הושלם" && todo.completed) ||
        (searchLower === "בתהליך" && !todo.completed)
      );
    })
    .sort((a, b) => {
      if (sortBy === "id") return a.id - b.id;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "completed")
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
    });

  return (
    <div className="posts-container">
      {/* כותרת וניווט */}
      <header className="posts-header">
        <div className="header-content">
          <h1>📝 ניהול משימות</h1>
          <button 
            onClick={() => navigate(`/home/users/${userId}`)} 
            className="back-btn"
          >
            חזור לעמוד הבית
          </button>
        </div>
      </header>

      <div className="posts-content">
        {/* פאנל בקרה */}
        <div className="controls-panel">
          <div className="search-section">
            <h3>חיפוש משימות</h3>
            <div className="search-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="search-select"
              >
                <option value="id">מיין לפי מזהה</option>
                <option value="title">מיין לפי כותרת</option>
                <option value="completed">מיין לפי סטטוס</option>
              </select>
              <input
                type="text"
                placeholder="חפש משימות..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="actions-section">
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="הכנס משימה חדשה..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '10px',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                onClick={handleAdd}
                className="action-btn add-btn"
                style={{ width: '100%' }}
              >
                הוסף משימה
              </button>
            </div>
            <div className="stats">
              <span>סה"כ משימות: {todos.length}</span>
              <span>הושלמו: {todos.filter(t => t.completed).length}</span>
              <span>בתהליך: {todos.filter(t => !t.completed).length}</span>
            </div>
          </div>
        </div>

        {/* רשימת משימות */}
        <div className="posts-list" style={{ maxWidth: 'none', margin: '0' }}>
          <h3>רשימת משימות ({filteredTodos.length})</h3>
          <div className="posts-items">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`post-item ${todo.completed ? 'completed-todo' : ''}`}
                style={{
                  opacity: todo.completed ? 0.7 : 1,
                  background: todo.completed ? 
                    'linear-gradient(145deg, #e8f5e8, #d4edda)' : 
                    'white'
                }}
              >
                <div className="post-header">
                  <span className="post-id">#{todo.id}</span>
                  <span className="post-user">משתמש: {userId}</span>
                  <span 
                    className="my-post-badge"
                    style={{
                      background: todo.completed ? 
                        'linear-gradient(45deg, #28a745, #20c997)' : 
                        'linear-gradient(45deg, #ffc107, #fd7e14)'
                    }}
                  >
                    {todo.completed ? 'הושלם' : 'בתהליך'}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                    style={{ 
                      transform: 'scale(1.3)', 
                      cursor: 'pointer',
                      accentColor: '#4CAF50'
                    }}
                  />
                  <input
                    type="text"
                    value={todo.title}
                    onChange={(e) => handleUpdate(todo.id, e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      fontSize: '1.1rem',
                      fontWeight: todo.completed ? 'normal' : 'bold',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#666' : '#333'
                    }}
                  />
                </div>
                
                <div className="post-actions">
                  <button 
                    onClick={() => handleSave(todo.id)}
                    className="save-btn"
                    style={{
                      backgroundColor: "#2ecc71",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "15px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                  >
                    שמור
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(todo.id)}
                    className="delete-btn"
                  >
                    מחק
                  </button>
                </div>
              </div>
            ))}
            
            {filteredTodos.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#666',
                fontSize: '1.1rem'
              }}>
                {search ? 'לא נמצאו משימות התואמות לחיפוש' : 'אין משימות עדיין'}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .completed-todo {
          border-color: #28a745 !important;
        }
        
        .completed-todo:hover {
          border-color: #20c997 !important;
          transform: translateX(-5px);
        }
        
        @media (max-width: 768px) {
          .controls-panel {
            grid-template-columns: 1fr;
          }
          
          .search-controls {
            flex-direction: column;
            gap: 10px;
          }
          
          .search-input,
          .search-select {
            width: 100%;
          }
          
          .post-actions {
            flex-wrap: wrap;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
}