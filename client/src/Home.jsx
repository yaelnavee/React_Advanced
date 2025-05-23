import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Home.css';

function Home() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [todos, setTodos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  
  const navigate = useNavigate();

  // בדיקה אם המשתמש מחובר וטעינת הנתונים שלו
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      // אם אין משתמש מחובר, חזור לעמוד התחברות
      navigate('/');
      return;
    }
    
    try {
      // בדיקה אם הנתונים כבר object או צריכים parsing
      let user;
      if (typeof userData === 'string') {
        // אם זה string, נסה לעשות parse
        try {
          user = JSON.parse(userData);
        } catch {
          // אם ה-parse נכשל, זה אומר שזה כבר object כ-string
          user = userData;
        }
      } else {
        user = userData;
      }
      
      setCurrentUser(user);
      console.log('Current user loaded:', user);
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate('/');
    }
  }, [navigate]);

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

  // פונקציה להתנתקות
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('temp');
    navigate('/');
  };

  // פונקציה לניווט לעמודים שונים
  const navigateToPage = (page) => {
    navigate(`/${page}`);
  };

  // אם אין משתמש מחובר, הצג טעינה
  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">טוען...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* כותרת עליונה עם שם המשתמש וכפתורי ניווט */}
      <header className="home-header">
        <div className="user-welcome">
          <h1>שלום, {currentUser.name || currentUser.username}!</h1>
        </div>
        
        <nav className="main-navigation">
          <button 
            onClick={() => setShowUserInfo(true)} 
            className="nav-btn info-btn"
            title="מידע אישי"
          >
            Info
          </button>
          <button 
            onClick={() => navigateToPage('todos')} 
            className="nav-btn todos-btn"
            title="משימות"
          >
            Todos
          </button>
          <button 
            onClick={() => navigateToPage('posts')} 
            className="nav-btn posts-btn"
            title="פוסטים"
          >
            Posts
          </button>
          <button 
            onClick={() => navigateToPage('albums')} 
            className="nav-btn albums-btn"
            title="אלבומים"
          >
            Albums
          </button>
          <button 
            onClick={handleLogout} 
            className="nav-btn logout-btn"
            title="התנתק"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* מודל מידע אישי */}
      {showUserInfo && (
        <div className="modal-overlay" onClick={() => setShowUserInfo(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>מידע אישי</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowUserInfo(false)}
                title="סגור"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="detail-item">
                  <strong>שם:</strong> {currentUser.name || 'לא צוין'}
                </div>
                <div className="detail-item">
                  <strong>שם משתמש:</strong> {currentUser.username}
                </div>
                <div className="detail-item">
                  <strong>אימייל:</strong> {currentUser.email || 'לא צוין'}
                </div>
                <div className="detail-item">
                  <strong>טלפון:</strong> {currentUser.phone || 'לא צוין'}
                </div>
                {currentUser.address && (
                  <div className="detail-item">
                    <strong>כתובת:</strong> {`${currentUser.address.street || ''} ${currentUser.address.suite || ''}, ${currentUser.address.city || ''}`}
                  </div>
                )}
                {currentUser.company && (
                  <div className="detail-item">
                    <strong>חברה:</strong> {currentUser.company.name || 'לא צוין'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="home-content">
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
        <div className="actions-section">
          <h2>פעולות מהירות</h2>
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
        </div>

        {/* סטטיסטיקות מהירות */}
        <div className="stats-section">
          <h2>סטטיסטיקות</h2>
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
    </div>
  );
}

export default Home;