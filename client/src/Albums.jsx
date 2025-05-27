import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './css/Posts.css'; // שימוש באותו CSS של הפוסטים

function Albums() {
  const { userId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [nextId, setNextId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const getAlbums = () => {
    fetch(`http://localhost:3000/albums?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setAlbums(data));

    fetch(`http://localhost:3000/albums`)
      .then((res) => res.json())
      .then((data) =>
        setNextId((Number(data[data.length - 1].id) + 1).toString())
      );
  };

  useEffect(() => {
    getAlbums();
  }, []);

  const handleClickAlbum = (id) => {
    navigate(`/users/${userId}/albums/${id}/photos`);
  };

  const addAlbum = async () => {
    if (!newTitle.trim()) return;

    const newAlbum = {
      userId: userId,
      id: nextId,
      title: newTitle,
    };

    await fetch("http://localhost:3000/albums", {
      method: "POST",
      body: JSON.stringify(newAlbum),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    setShowPopup(false);
    setNewTitle("");
    getAlbums();
  };

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.id.toString().includes(searchQuery)
  );

  return (
    <div className="posts-container">
      {/* כותרת וניווט */}
      <header className="posts-header">
        <div className="header-content">
          <h1>🎵 ניהול אלבומים</h1>
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
            <h3>חיפוש אלבומים</h3>
            <div className="search-controls">
              <input
                type="text"
                placeholder="חפש לפי מזהה או כותרת..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="actions-section">
            <button 
              onClick={() => setShowPopup(true)} 
              className="action-btn add-btn"
            >
              הוסף אלבום חדש
            </button>
            <div className="stats">
              <span>סה"כ אלבומים: {albums.length}</span>
            </div>
          </div>
        </div>

        {/* רשת אלבומים */}
        <div className="posts-list" style={{ maxWidth: 'none', margin: '0' }}>
          <h3>רשימת אלבומים ({filteredAlbums.length})</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                className="post-item album-card"
                onClick={() => handleClickAlbum(album.id)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  minHeight: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="post-header" style={{ 
                  justifyContent: 'center', 
                  marginBottom: '15px',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  <span className="post-id" style={{ 
                    color: 'white', 
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    #{album.id}
                  </span>
                </div>
                
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  lineHeight: '1.4',
                  maxWidth: '200px',
                  wordBreak: 'break-word'
                }}>
                  {album.title}
                </div>

                <div style={{
                  marginTop: '10px',
                  fontSize: '0.9rem',
                  opacity: '0.8'
                }}>
                  לחץ לצפייה בתמונות
                </div>
              </div>
            ))}

            {/* כרטיס הוספה */}
            <div
              className="post-item add-album-card"
              onClick={() => setShowPopup(true)}
              style={{
                border: '3px dashed #667eea',
                background: 'rgba(102, 126, 234, 0.1)',
                minHeight: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: '#667eea'
              }}
            >
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                +
              </div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                הוסף אלבום חדש
              </div>
            </div>
          </div>
          
          {filteredAlbums.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              {searchQuery ? 'לא נמצאו אלבומים התואמים לחיפוש' : 'אין אלבומים עדיין'}
            </div>
          )}
        </div>
      </div>

      {/* מודל הוספת אלבום */}
      {showPopup && (
        <div className="modal-overlay" onClick={() => setShowPopup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>הוסף אלבום חדש</h2>
              <button 
                onClick={() => setShowPopup(false)} 
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="כותרת האלבום"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="form-input"
                onKeyPress={(e) => e.key === 'Enter' && addAlbum()}
              />
              <div className="modal-actions">
                <button onClick={addAlbum} className="save-btn">
                  שמור
                </button>
                <button onClick={() => setShowPopup(false)} className="cancel-btn">
                  בטל
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .album-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .add-album-card:hover {
          background: rgba(102, 126, 234, 0.2);
          border-color: #764ba2;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
        }
        
        @media (max-width: 768px) {
          .posts-content .posts-list > div {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 15px;
          }
          
          .controls-panel {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .search-controls {
            flex-direction: column;
            gap: 10px;
          }
        }
        
        @media (max-width: 480px) {
          .posts-content .posts-list > div {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .album-card,
          .add-album-card {
            min-height: 120px;
          }
          
          .modal-content {
            width: 95%;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Albums;