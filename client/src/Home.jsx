import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Home.css';

function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  
  const navigate = useNavigate();

  // בדיקה אם המשתמש מחובר
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      navigate('/');
      return;
    }
    
    try {
      let user;
      if (typeof userData === 'string') {
        try {
          user = JSON.parse(userData);
        } catch {
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

  // פונקציה להתנתקות
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('temp');
    navigate('/');
  };
  
  // פונקציה לניווט לעמודים שונים
  const navigateToPage = (page) => {
    if (currentUser && currentUser.id) {
      navigate(`/users/${currentUser.id}/${page}`);
    } else {
      navigate(`/${page}`);
    }
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
     
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-icon">🎉</div>
            <h2>ברוכים הבאים למערכת ניהול התוכן שלכם!</h2>
            <p>כאן תוכלו לנהל את המשימות, הפוסטים והאלבומים שלכם בקלות ובנוחות</p>
          </div>
        </div>

    
        <div className="quick-nav-section">
          <h3>ניווט מהיר</h3>
          <div className="nav-cards-grid">
            <div 
              className="nav-card todos-card"
              onClick={() => navigateToPage('todos')}
            >
              <div className="card-icon">✓</div>
              <h4>משימות</h4>
              <p>נהלו את המשימות היומיות שלכם</p>
            </div>

            <div 
              className="nav-card posts-card"
              onClick={() => navigateToPage('posts')}
            >
              <div className="card-icon">📝</div>
              <h4>פוסטים</h4>
              <p>כתבו ושתפו את המחשבות שלכם</p>
            </div>

            <div 
              className="nav-card albums-card"
              onClick={() => navigateToPage('albums')}
            >
              <div className="card-icon">📸</div>
              <h4>אלבומים</h4>
              <p>ארגנו ושתפו את התמונות שלכם</p>
            </div>
          </div>
        </div>

        <div className="info-footer">
          <div className="info-cards">
            <div className="info-card">
              <h5>🚀 מהיר ופשוט</h5>
              <p>ממשק נקי ואינטואיטיבי לניהול קל</p>
            </div>
            
            <div className="info-card">
              <h5>🔒 בטוח ואמין</h5>
              <p>המידע שלכם נשמר בצורה בטוחה</p>
            </div>
            
            <div className="info-card">
              <h5>📱 רספונסיבי</h5>
              <p>עובד מושלם על כל המכשירים</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;