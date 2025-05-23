import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [todos, setTodos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // פונקציה לטעינת משתמשים
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('שגיאה בטעינת המשתמשים');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לטעינת פוסטים
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('שגיאה בטעינת הפוסטים');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לטעינת משימות
  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError('שגיאה בטעינת המשימות');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לטעינת אלבומים
  const loadAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/albums');
      if (!response.ok) throw new Error('Failed to fetch albums');
      const data = await response.json();
      setAlbums(data);
    } catch (err) {
      setError('שגיאה בטעינת האלבומים');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לניווט לעמודים שונים
  const navigateToPage = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* כותרת ראשית */}
        <h1 className="home-title">ברוכים הבאים לעמוד הבית</h1>
        
        <p className="home-subtitle">
          נהל את המשתמשים, פוסטים, משימות ואלבומים שלך במקום אחד
        </p>

        {/* הודעות שגיאה וטעינה */}
        {loading && (
          <div className="message loading-message">
            טוען נתונים...
          </div>
        )}

        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}

        {/* כפתורי טעינת נתונים */}
        <div className="buttons-grid">
          <button
            onClick={loadUsers}
            className="action-button users-button"
          >
            טען משתמשים ({users.length})
          </button>

          <button
            onClick={loadPosts}
            className="action-button posts-button"
          >
            טען פוסטים ({posts.length})
          </button>

          <button
            onClick={loadTodos}
            className="action-button todos-button"
          >
            טען משימות ({todos.length})
          </button>

          <button
            onClick={loadAlbums}
            className="action-button albums-button"
          >
            טען אלבומים ({albums.length})
          </button>
        </div>

        {/* כפתורי ניווט */}
        <div className="buttons-grid">
          <button
            onClick={() => navigateToPage('posts')}
            className="nav-button posts-nav"
          >
            עבור לעמוד פוסטים
          </button>

          <button
            onClick={() => navigateToPage('todos')}
            className="nav-button todos-nav"
          >
            עבור לעמוד משימות
          </button>

          <button
            onClick={() => navigateToPage('albums')}
            className="nav-button albums-nav"
          >
            עבור לעמוד אלבומים
          </button>
        </div>

        {/* סטטיסטיקות מהירות */}
        <div className="stats-grid">
          <div className="stat-card users-stat">
            <h3>משתמשים</h3>
            <p>{users.length}</p>
          </div>
          
          <div className="stat-card posts-stat">
            <h3>פוסטים</h3>
            <p>{posts.length}</p>
          </div>
          
          <div className="stat-card todos-stat">
            <h3>משימות</h3>
            <p>{todos.length}</p>
          </div>
          
          <div className="stat-card albums-stat">
            <h3>אלבומים</h3>
            <p>{albums.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;