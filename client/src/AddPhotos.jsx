import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './css/Posts.css';

function AddPhotos() {
  const { userId, albumId } = useParams();
  const navigate = useNavigate();
  
  const [availablePhotos, setAvailablePhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // טעינת תמונות זמינות
  const loadAvailablePhotos = async () => {
    setLoading(true);
    try {
      // טען את כל התמונות
      const allPhotosResponse = await fetch('http://localhost:3000/photos');
      const allPhotos = await allPhotosResponse.json();
      
      //של התמונות המקוריות albumIds
      const originalPhotosMap = new Map();
      
      // מיין לפי ID לקבל את המקוריות ראשונות
      const sortedPhotos = allPhotos.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      
      // זהה תמונות מקוריות לפי כותרת ו-URL
      sortedPhotos.forEach(photo => {
        const key = `${photo.title}-${photo.url}`;
        if (!originalPhotosMap.has(key)) {
          originalPhotosMap.set(key, photo);
        }
      });
      
      // קבל רשימה של התמונות שכבר קיימות באלבום הנוכחי
      const currentAlbumPhotos = allPhotos.filter(photo => 
        parseInt(photo.albumId) === parseInt(albumId)
      );
      
      // צור סט של מפתחות התמונות שכבר באלבום
      const currentAlbumPhotoKeys = new Set(
        currentAlbumPhotos.map(photo => `${photo.title}-${photo.url}`)
      );
      
      // סנן תמונות זמינות - רק תמונות שלא קיימות באלבום הנוכחי
      const availablePhotos = Array.from(originalPhotosMap.values()).filter(photo => {
        const key = `${photo.title}-${photo.url}`;
        return !currentAlbumPhotoKeys.has(key);
      });
      
      setAvailablePhotos(availablePhotos);
      console.log(`Loaded ${availablePhotos.length} available photos for album ${albumId}`);
    } catch (err) {
      console.error('Error loading photos:', err);
      setError('שגיאה בטעינת התמונות');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailablePhotos();
  }, [albumId]);

  // בחירת תמונה
  const togglePhotoSelection = (photo) => {
    setSelectedPhotos(prev => {
      const isSelected = prev.some(p => p.id === photo.id);
      if (isSelected) {
        return prev.filter(p => p.id !== photo.id);
      } else {
        return [...prev, photo];
      }
    });
  };

  // הוספת התמונות הנבחרות לאלבום
  const handleAddSelectedPhotos = async () => {
    if (selectedPhotos.length === 0) {
      setError('אנא בחר לפחות תמונה אחת');
      return;
    }

    setLoading(true);
    try {
      // קבלת ID הבא לתמונות
      const allPhotosResponse = await fetch('http://localhost:3000/photos');
      const allPhotos = await allPhotosResponse.json();
      let nextId = allPhotos.length > 0 ? Math.max(...allPhotos.map(p => parseInt(p.id))) + 1 : 1;

      // יצירת העתקים של התמונות הנבחרות
      for (const photo of selectedPhotos) {
        const newPhoto = {
          albumId: parseInt(albumId),
          id: nextId.toString(),
          title: photo.title,
          url: photo.url,
          thumbnailUrl: photo.thumbnailUrl
        };

        const response = await fetch('http://localhost:3000/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPhoto)
        });

        if (!response.ok) {
          throw new Error(`Failed to add photo ${photo.title}`);
        }

        nextId++;
      }

      // חזרה לעמוד התמונות
      navigate(`/users/${userId}/albums/${albumId}/photos`);
    } catch (err) {
      console.error('Error adding photos:', err);
      setError('שגיאה בהוספת התמונות');
    } finally {
      setLoading(false);
    }
  };

  // סינון תמונות לפי חיפוש
  const filteredPhotos = availablePhotos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.id.toString().includes(searchTerm)
  );

  return (
    <div className="posts-container">
      {/* כותרת וניווט */}
      <header className="posts-header">
        <div className="header-content">
          <h1>📷 הוסף תמונות לאלבום</h1>
          <button 
            onClick={() => navigate(`/users/${userId}/albums/${albumId}/photos`)} 
            className="back-btn"
          >
            חזור לאלבום
          </button>
        </div>
      </header>

      {/* הודעות שגיאה וטעינה */}
      {loading && <div className="message loading-message">טוען תמונות...</div>}
      {error && (
        <div className="message error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <div className="posts-content">
        {/* פאנל בקרה */}
        <div className="controls-panel">
          <div className="search-section">
            <h3>חיפוש תמונות</h3>
            <div className="search-controls">
              <input
                type="text"
                placeholder="חפש תמונות לפי כותרת או מזהה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="actions-section">
            <button 
              onClick={handleAddSelectedPhotos}
              className="action-btn add-btn"
              disabled={selectedPhotos.length === 0 || loading}
              style={{
                opacity: selectedPhotos.length === 0 ? 0.5 : 1,
                cursor: selectedPhotos.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              הוסף {selectedPhotos.length} תמונות נבחרות
            </button>
            <div className="stats">
              <span>תמונות זמינות: {filteredPhotos.length}</span>
              <span>נבחרו: {selectedPhotos.length}</span>
            </div>
          </div>
        </div>

        {/* רשת תמונות */}
        <div className="posts-list" style={{ maxWidth: 'none', margin: '0' }}>
          <h3>תמונות זמינות ({filteredPhotos.length})</h3>
          
          {filteredPhotos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              {searchTerm ? 'לא נמצאו תמונות התואמות לחיפוש' : 'אין תמונות זמינות להוספה'}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}>
              {filteredPhotos.map((photo) => {
                const isSelected = selectedPhotos.some(p => p.id === photo.id);
                return (
                  <div
                    key={photo.id}
                    className={`post-item photo-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => togglePhotoSelection(photo)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '3px solid #4CAF50' : '2px solid #e0e0e0',
                      borderRadius: '12px',
                      padding: '15px',
                      transition: 'all 0.3s ease',
                      background: isSelected ? 'rgba(76, 175, 80, 0.1)' : 'white',
                      position: 'relative'
                    }}
                  >
                    {/* אינדיקטור בחירה */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#4CAF50',
                        color: 'white',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </div>
                    )}

                    {/* תמונה */}
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '10px'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />

                    {/* פרטי התמונה */}
                    <div className="post-header" style={{ marginBottom: '8px' }}>
                      <span className="post-id" style={{ fontSize: '0.8rem' }}>#{photo.id}</span>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>
                        אלבום: {photo.albumId}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.9rem',
                      color: '#333',
                      fontWeight: '500',
                      lineHeight: '1.3',
                      minHeight: '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {photo.title}
                    </div>

                    {/* כפתור בחירה */}
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '5px 12px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: isSelected ? '#4CAF50' : '#e0e0e0',
                        color: isSelected ? 'white' : '#666'
                      }}>
                        {isSelected ? 'נבחרה' : 'לחץ לבחירה'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .photo-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .photo-card.selected {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }
        
        @media (max-width: 768px) {
          .posts-content .posts-list > div:last-child {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
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
          .posts-content .posts-list > div:last-child {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          
          .photo-card {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default AddPhotos;