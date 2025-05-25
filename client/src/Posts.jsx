import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/Posts.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // מצבי UI
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title'); // 'id' או 'title'
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  
  // טפסי הוספה ועריכה
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [newComment, setNewComment] = useState('');
  
  const navigate = useNavigate();
  const { userId } = useParams();

  // טעינת נתונים בתחילה
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
    
    if (userId && user.id && parseInt(userId) !== parseInt(user.id)) {
      navigate('/home');
      return;
    }
    
    setCurrentUser(user);
    loadPosts();
  } catch (err) {
    console.error('Error loading user:', err);
    navigate('/');
  }
}, [navigate, userId]);

  // טעינת פוסטים
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

  // טעינת תגובות לפוסט
  const loadComments = async (postId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/comments?postId=${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
      setShowComments(true);
    } catch (err) {
      setError('שגיאה בטעינת התגובות');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // הוספת פוסט חדש
  const addPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      setError('נא למלא את כל השדות');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        userId: currentUser.id,
        id: Math.max(...posts.map(p => p.id), 0) + 1,
        title: newPost.title,
        body: newPost.body
      };

      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (!response.ok) throw new Error('Failed to add post');
      
      setPosts([...posts, postData]);
      setNewPost({ title: '', body: '' });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('שגיאה בהוספת הפוסט');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // מחיקת פוסט
  const deletePost = async (postId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete post');
      
      setPosts(posts.filter(p => p.id !== postId));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
        setShowComments(false);
      }
    } catch (err) {
      setError('שגיאה במחיקת הפוסט');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // עדכון פוסט
  const updatePost = async () => {
    if (!editingPost.title.trim() || !editingPost.body.trim()) {
      setError('נא למלא את כל השדות');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost)
      });

      if (!response.ok) throw new Error('Failed to update post');
      
      setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p));
      if (selectedPost && selectedPost.id === editingPost.id) {
        setSelectedPost(editingPost);
      }
      setShowEditForm(false);
      setEditingPost(null);
    } catch (err) {
      setError('שגיאה בעדכון הפוסט');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // הוספת תגובה
  const addComment = async () => {
    if (!newComment.trim()) {
      setError('נא להכניס תוכן לתגובה');
      return;
    }

    setLoading(true);
    try {
      const commentData = {
        postId: selectedPost.id,
        id: Math.max(...comments.map(c => c.id), 0) + 1,
        name: currentUser.name || currentUser.username,
        email: currentUser.email || 'user@example.com',
        body: newComment,
        userId: currentUser.id
      };

      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });

      if (!response.ok) throw new Error('Failed to add comment');
      
      setComments([...comments, commentData]);
      setNewComment('');
    } catch (err) {
      setError('שגיאה בהוספת התגובה');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // מחיקת תגובה
  const deleteComment = async (commentId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את התגובה?')) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      setError('שגיאה במחיקת התגובה');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // סינון פוסטים לפי חיפוש
  const filteredPosts = posts.filter(post => {
    if (!searchTerm) return true;
    
    if (searchBy === 'id') {
      return post.id.toString().includes(searchTerm);
    } else {
      return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  // פוסטים של המשתמש הנוכחי
  const userPosts = posts.filter(post => post.userId === currentUser?.id);

  if (!currentUser) {
    return <div className="loading">טוען...</div>;
  }

  return (
    <div className="posts-container">
      {/* כותרת וניווט */}
      <header className="posts-header">
        <div className="header-content">
          <h1>ניהול פוסטים</h1>
          <button 
            onClick={() => navigate('/home')} 
            className="back-btn"
          >
            חזור לעמוד הבית
          </button>
        </div>
      </header>

      {/* הודעות שגיאה וטעינה */}
      {loading && <div className="message loading-message">טוען...</div>}
      {error && (
        <div className="message error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <div className="posts-content">
        {/* פאנל חיפוש ופעולות */}
        <div className="controls-panel">
          <div className="search-section">
            <h3>חיפוש פוסטים</h3>
            <div className="search-controls">
              <select 
                value={searchBy} 
                onChange={(e) => setSearchBy(e.target.value)}
                className="search-select"
              >
                <option value="title">לפי כותרת</option>
                <option value="id">לפי מזהה</option>
              </select>
              <input
                type="text"
                placeholder={`חפש ${searchBy === 'id' ? 'מזהה' : 'כותרת'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="actions-section">
            <button 
              onClick={() => setShowAddForm(true)} 
              className="action-btn add-btn"
            >
              הוסף פוסט חדש
            </button>
            <div className="stats">
              <span>סה"כ פוסטים: {posts.length}</span>
              <span>הפוסטים שלי: {userPosts.length}</span>
            </div>
          </div>
        </div>

        {/* רשימת פוסטים */}
        <div className="posts-grid">
          <div className="posts-list">
            <h3>רשימת פוסטים ({filteredPosts.length})</h3>
            <div className="posts-items">
              {filteredPosts.map(post => (
                <div 
                  key={post.id} 
                  className={`post-item ${selectedPost?.id === post.id ? 'selected' : ''}`}
                >
                  <div className="post-header">
                    <span className="post-id">#{post.id}</span>
                    <span className="post-user">משתמש: {post.userId}</span>
                    {post.userId === currentUser.id && (
                      <span className="my-post-badge">שלי</span>
                    )}
                  </div>
                  
                  <h4 className="post-title">{post.title}</h4>
                  
                  <div className="post-actions">
                    <button 
                      onClick={() => setSelectedPost(post)}
                      className="select-btn"
                    >
                      {selectedPost?.id === post.id ? 'נבחר' : 'בחר'}
                    </button>
                    
                    {post.userId === currentUser.id && (
                      <>
                        <button 
                          onClick={() => {
                            setEditingPost({...post});
                            setShowEditForm(true);
                          }}
                          className="edit-btn"
                        >
                          ערוך
                        </button>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="delete-btn"
                        >
                          מחק
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* פאנל פוסט נבחר */}
          {selectedPost && (
            <div className="selected-post-panel">
              <div className="selected-post">
                <div className="selected-header">
                  <h3>פוסט נבחר #{selectedPost.id}</h3>
                  <button 
                    onClick={() => {
                      setSelectedPost(null);
                      setShowComments(false);
                    }}
                    className="close-btn"
                  >
                    ×
                  </button>
                </div>
                
                <div className="post-content">
                  <h4>{selectedPost.title}</h4>
                  <p>{selectedPost.body}</p>
                </div>

                <div className="post-meta">
                  <span>מזהה: {selectedPost.id}</span>
                  <span>משתמש: {selectedPost.userId}</span>
                </div>

                <div className="comments-section">
                  <div className="comments-header">
                    <button 
                      onClick={() => loadComments(selectedPost.id)}
                      className="load-comments-btn"
                    >
                      {showComments ? 'רענן תגובות' : 'טען תגובות'}
                    </button>
                  </div>

                  {showComments && (
                    <>
                      {/* הוספת תגובה */}
                      {selectedPost.userId === currentUser.id && (
                        <div className="add-comment">
                          <textarea
                            placeholder="הכנס תגובה חדשה..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="comment-input"
                          />
                          <button onClick={addComment} className="add-comment-btn">
                            הוסף תגובה
                          </button>
                        </div>
                      )}

                      {/* רשימת תגובות */}
                      <div className="comments-list">
                        <h5>תגובות ({comments.length})</h5>
                        {comments.map(comment => (
                          <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                              <strong>{comment.name}</strong>
                              <span className="comment-email">{comment.email}</span>
                              {comment.userId === currentUser.id && (
                                <div className="comment-actions">
                                  <span className="my-comment">שלי</span>
                                  <button 
                                    onClick={() => deleteComment(comment.id)}
                                    className="delete-comment-btn"
                                  >
                                    מחק
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="comment-body">{comment.body}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* מודל הוספת פוסט */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>הוסף פוסט חדש</h2>
              <button onClick={() => setShowAddForm(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="כותרת הפוסט"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="form-input"
              />
              <textarea
                placeholder="תוכן הפוסט"
                value={newPost.body}
                onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                className="form-textarea"
                rows="4"
              />
              <div className="modal-actions">
                <button onClick={addPost} className="save-btn">שמור</button>
                <button onClick={() => setShowAddForm(false)} className="cancel-btn">בטל</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* מודל עריכת פוסט */}
      {showEditForm && editingPost && (
        <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>ערוך פוסט #{editingPost.id}</h2>
              <button onClick={() => setShowEditForm(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="כותרת הפוסט"
                value={editingPost.title}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                className="form-input"
              />
              <textarea
                placeholder="תוכן הפוסט"
                value={editingPost.body}
                onChange={(e) => setEditingPost({...editingPost, body: e.target.value})}
                className="form-textarea"
                rows="4"
              />
              <div className="modal-actions">
                <button onClick={updatePost} className="save-btn">שמור שינויים</button>
                <button onClick={() => setShowEditForm(false)} className="cancel-btn">בטל</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;