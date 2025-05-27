import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './css/Posts.css';

function Photos() {
  const navigate = useNavigate();
  const { userId, albumId } = useParams();
  const hasLoadedInitial = useRef(false);

  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const photosPerPage = 6;
  const [hasMore, setHasMore] = useState(true);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const getPhotos = () => {
    fetch(
      `http://localhost:3000/photos?albumId=${albumId}&_start=${
        page * photosPerPage
      }&_limit=${photosPerPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPhotos((prev) => [...prev, ...data]);
        if (data.length < photosPerPage) {
          setHasMore(false);
        }
      });
  };

  // רענון מלא של התמונות (לאחר הוספה/מחיקה)
  const refreshPhotos = () => {
    setPhotos([]);
    setPage(0);
    setHasMore(true);
    hasLoadedInitial.current = false;
    
    // טען מחדש
    fetch(`http://localhost:3000/photos?albumId=${albumId}`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setHasMore(false); // כל התמונות נטענו
      });
  };

  useEffect(() => {
    if (!hasLoadedInitial.current) {
      hasLoadedInitial.current = true;
      getPhotos();
    }
  }, []);

  useEffect(() => {
    if (page === 0) return;
    getPhotos();
  }, [page]);

  // רענון כשחוזרים מעמוד הוספת תמונות
  useEffect(() => {
    const handleFocus = () => {
      refreshPhotos();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setEditedTitle(photo.title);
  };

  const handleSaveTitle = async () => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((p) =>
        p.id === selectedPhoto.id ? { ...p, title: editedTitle } : p
      )
    );
    setSelectedPhoto(null);

    const newPhoto = {
      albumId: albumId,
      id: selectedPhoto.id,
      title: editedTitle,
      url: selectedPhoto.url,
      thumbnailUrl: selectedPhoto.thumbnailUrl,
    };

    await fetch(`http://localhost:3000/photos/${selectedPhoto.id}`, {
      method: "PUT",
      body: JSON.stringify(newPhoto),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את התמונה?')) {
      return;
    }

    // הסר מהתצוגה מיד
    setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== photoId));

    try {
      const response = await fetch(`http://localhost:3000/photos/${photoId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        console.log(`Photo ${photoId} deleted successfully - now available for re-adding`);
      }
    } catch (error) {
      console.error("Failed to delete photo", error);
      // במקרה של שגיאה, רענן את הרשימה
      refreshPhotos();
    }
  };

  const handleAddPhoto = () => {
    navigate(`/users/${userId}/albums/${albumId}/photos/addphotos`);
  };

  return (
    <div className="posts-container">
      {/* כותרת וניווט */}
      <header className="posts-header">
        <div className="header-content">
          <h1>📸 תמונות האלבום</h1>
          <div className="header-buttons">
            <button 
              onClick={() => navigate(`/users/${userId}/albums`)} 
              className="back-btn"
            >
              חזור לאלבומים
            </button>
          </div>
        </div>
      </header>

      <div className="posts-content">
        {/* פאנל בקרה */}
        <div className="controls-panel">
          <div className="search-section">
            <h3>ניהול תמונות</h3>
            <p className="album-info">
              אלבום מספר: {albumId}
            </p>
          </div>

          <div className="actions-section">
            <button 
              onClick={handleAddPhoto}
              className="action-btn add-btn"
            >
              הוסף תמונות חדשות
            </button>
            <div className="stats">
              <span>תמונות באלבום: {photos.length}</span>
            </div>
          </div>
        </div>

        {/* רשת התמונות */}
        <div className="posts-list" style={{ maxWidth: 'none', margin: '0' }}>
          <h3>תמונות באלבום ({photos.length})</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="post-item"
                style={{
                  position: "relative",
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  padding: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                  {/* כפתור מחיקה */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(231, 76, 60, 0.9)",
                      border: "none",
                      color: "white",
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "all 0.2s ease",
                      zIndex: 10
                    }}
                    title="מחק תמונה"
                    onMouseEnter={(e) => {
                      e.target.style.background = "#c0392b";
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(231, 76, 60, 0.9)";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    ✕
                  </button>

                  {/* כותרת התמונה */}
                  <div className="post-header" style={{ marginBottom: '8px' }}>
                    <span className="post-id" style={{ fontSize: '0.8rem' }}>#{photo.id}</span>
                  </div>

                  {/* תמונה */}
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    style={{ 
                      width: "100%", 
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px"
                    }}
                    onClick={() => handlePhotoClick(photo)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                    }}
                  />
                  
                  {/* כותרת התמונה */}
                  <div 
                    style={{ 
                      fontSize: "14px", 
                      color: "#333",
                      fontWeight: "500",
                      lineHeight: "1.3",
                      minHeight: "40px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical"
                    }}
                    onClick={() => handlePhotoClick(photo)}
                  >
                    {photo.title}
                  </div>

                </div>
              ))}

              {/* כרטיס הוספת תמונה */}
              <div
                onClick={handleAddPhoto}
                className="post-item"
                style={{
                  background: "rgba(102, 126, 234, 0.1)",
                  border: "2px dashed #667eea",
                  borderRadius: "12px",
                  padding: "15px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  minHeight: "200px",
                  transition: "all 0.3s ease",
                  color: "#667eea"
                }}
              >
                <div style={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  marginBottom: "10px"
                }}>
                  +
                </div>
                <div style={{
                  fontSize: "1rem",
                  fontWeight: "600"
                }}>
                  הוסף תמונות חדשות
                </div>
              </div>
            </div>

            {/* כפתור טעינה נוספת */}
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button
                  onClick={handleLoadMore}
                  className="action-btn"
                  style={{
                    background: "linear-gradient(45deg, #3498db, #2980b9)",
                    padding: "12px 24px",
                    fontSize: "1rem"
                  }}
                >
                  טען עוד תמונות
                </button>
              </div>
            )}

            {photos.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#666',
                fontSize: '1.2rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📷</div>
                <div>אין תמונות באלבום זה</div>
                <div style={{ fontSize: '1rem', marginTop: '10px', color: '#999' }}>
                  לחץ על "הוסף תמונות חדשות" כדי להתחיל
                </div>
              </div>
            )}
            {/* פאנל תמונה נבחרת */}
          {selectedPhoto && (
            <div className="selected-post-panel">
              <div className="selected-post">
                <div className="selected-header">
                  <h3>תמונה נבחרת #{selectedPhoto.id}</h3>
                  <button 
                    onClick={() => setSelectedPhoto(null)} 
                    className="close-btn"
                  >
                    ×
                  </button>
                </div>
                
                <div className="post-content">
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                      src={selectedPhoto.url}
                      alt={selectedPhoto.title}
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        borderRadius: "8px"
                      }}
                      onError={(e) => {
                        e.target.src = selectedPhoto.thumbnailUrl;
                      }}
                    />
                  </div>
                  
                  <h4>כותרת התמונה:</h4>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      marginBottom: '15px'
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
                  />
                </div>

                <div className="post-meta">
                  <span>מזהה: {selectedPhoto.id}</span>
                  <span>אלבום: {selectedPhoto.albumId}</span>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button 
                    onClick={handleSaveTitle} 
                    className="action-btn add-btn"
                    style={{ marginLeft: '10px' }}
                  >
                    שמור כותרת
                  </button>
                  <button 
                    onClick={() => setSelectedPhoto(null)} 
                    className="action-btn"
                    style={{ background: '#e0e0e0', color: '#666' }}
                  >
                    בטל
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* מודל עריכת כותרת (גיבוי) */}
      {selectedPhoto && window.innerWidth <= 768 && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>ערוך כותרת תמונה</h2>
              <button 
                onClick={() => setSelectedPhoto(null)} 
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <img
                src={selectedPhoto.thumbnailUrl}
                alt={selectedPhoto.title}
                className="modal-photo"
              />
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="form-input"
                placeholder="כותרת התמונה"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
              />
              <div className="modal-actions">
                <button onClick={handleSaveTitle} className="save-btn">
                  שמור
                </button>
                <button onClick={() => setSelectedPhoto(null)} className="cancel-btn">
                  בטל
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Photos;