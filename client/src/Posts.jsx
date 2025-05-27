import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/Posts.css';

function Posts() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // מצבי UI
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  
  // טפסי הוספה ועריכה
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [newComment, setNewComment] = useState('');

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
      getPosts();
    } catch (err) {
      console.error('Error loading user:', err);
      navigate('/');
    }
  }, [navigate, userId]);

  // טעינת פוסטים (כמו getTodos)
  const getPosts = () => {
    fetch(`http://localhost:3000/posts?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        localStorage.setItem(`posts_${userId}`, JSON.stringify(data));
      })
      .catch((err) => {
        console.error('Error fetching posts:', err);
        const savedPosts = localStorage.getItem(`posts_${userId}`);
        if (savedPosts) {
          setPosts(JSON.parse(savedPosts));
          setError('נטענו פוסטים מהמטמון המקומי');
        } else {
          setError('שגיאה בטעינת הפוסטים');
        }
      });
  };

  // פונקציה לתיקון תגובות עם postId null
  const fixNullPostIdComments = async (targetPostId) => {
    try {
      const response = await fetch('http://localhost:3000/comments');
      const allComments = await response.json();
      
      // מצא תגובות עם postId null של המשתמש הנוכחי
      const nullPostIdComments = allComments.filter(comment => 
        comment.postId === null && comment.userId === userId
      );
      
      // עדכן את התגובות האלה עם הפוסט הנוכחי
      for (const comment of nullPostIdComments) {
        const updatedComment = { ...comment, postId: parseInt(targetPostId) };
        
        await fetch(`http://localhost:3000/comments/${comment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedComment)
        });
      }
      
      console.log(`Fixed ${nullPostIdComments.length} comments with null postId`);
      return nullPostIdComments.length > 0;
    } catch (err) {
      console.error('Error fixing null postId comments:', err);
      return false;
    }
  };
  const getComments = (postId) => {
    console.log(`Loading comments for post ${postId}`);
    
    fetch(`http://localhost:3000/comments`)
      .then((res) => res.json())
      .then((allComments) => {
        // סנן את התגובות לפי postId או אם postId הוא null והתגובה שייכת למשתמש הנוכחי
        const filteredComments = allComments.filter(comment => {
          return comment.postId === parseInt(postId) || 
                 (comment.postId === null && comment.userId === userId);
        });
        
        console.log(`Found ${filteredComments.length} comments for post ${postId}:`, filteredComments);
        setComments(filteredComments);
        setShowComments(true);
        localStorage.setItem(`comments_${postId}`, JSON.stringify(filteredComments));
      })
      .catch((err) => {
        console.error('Error fetching comments:', err);
        const savedComments = localStorage.getItem(`comments_${postId}`);
        if (savedComments) {
          setComments(JSON.parse(savedComments));
          setShowComments(true);
          setError('נטענו תגובות מהמטמון המקומי');
        } else {
          setError('שגיאה בטעינת התגובות');
          setComments([]);
          setShowComments(true);
        }
      });
  };

  // הוספת פוסט חדש (כמו handleAdd)
  const handleAddPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return;

    // קבלת ID הבא מכל הפוסטים
    const allPostsResponse = await fetch('http://localhost:3000/posts');
    const allPosts = await allPostsResponse.json();
    const nextId = (Number(allPosts[allPosts.length - 1]?.id || 0) + 1).toString();

    const postData = {
      userId: parseInt(userId),
      id: nextId,
      title: newPost.title,
      body: newPost.body
    };

    await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });

    getPosts(); // רענון הרשימה
    setNewPost({ title: '', body: '' });
    setShowAddForm(false);
  };

  // מחיקת פוסט (עם טיפול בשגיאות)
  const handleDeletePost = async (postId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) return;

    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE'
      });
      
      // גם אם יש שגיאת 404, נמשיך להסיר את הפוסט מהמצב המקומי
      if (!response.ok && response.status !== 404) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      // נמשיך גם במקרה של שגיאה
    }
    
    getPosts(); // רענון הרשימה
    
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
      setShowComments(false);
    }
  };

  // שמירת שינויים בפוסט (עם טיפול בשגיאות)
  const handleSavePost = async (postId) => {
    const postToSave = posts.find(post => post.id === postId);
    if (!postToSave) return;
    
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postToSave)
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      localStorage.setItem(`posts_${userId}`, JSON.stringify(posts));
      
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(postToSave);
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError('שגיאה בשמירת הפוסט');
    }
  };

  // עדכון פוסט בזמן אמת
  const handleUpdatePost = (postId, field, newValue) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, [field]: newValue } : post
    ));
  };

  // עדכון פוסט במודל (כמו handleSave)
  const updatePost = async () => {
    if (!editingPost.title.trim() || !editingPost.body.trim()) return;

    await fetch(`http://localhost:3000/posts/${editingPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingPost)
    });

    getPosts(); // רענון הרשימה
    if (selectedPost && selectedPost.id === editingPost.id) {
      setSelectedPost(editingPost);
    }
    setShowEditForm(false);
    setEditingPost(null);
  };

  // הוספת תגובה (עם ID נכון)
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // קבלת ID הבא מכל התגובות
      const allCommentsResponse = await fetch('http://localhost:3000/comments');
      const allComments = await allCommentsResponse.json();
      
      // מציאת ה-ID הגדול ביותר
      const maxId = allComments.length > 0 ? Math.max(...allComments.map(c => parseInt(c.id))) : 0;
      const nextId = maxId + 1;

      console.log(`Adding comment with ID ${nextId} to post ${selectedPost.id}`);

      const commentData = {
        postId: parseInt(selectedPost.id), // וודא שזה מספר
        id: nextId.toString(),
        name: currentUser.name || currentUser.username,
        email: currentUser.email || 'user@example.com',
        body: newComment,
        userId: parseInt(userId)
      };

      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        getComments(selectedPost.id); // רענון התגובות
        setNewComment('');
        console.log('Comment added successfully');
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('שגיאה בהוספת התגובה');
    }
  };

  // מחיקת תגובה (כמו handleDelete)
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את התגובה?')) return;

    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'DELETE'
    });

    getComments(selectedPost.id); // רענון התגובות
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

  if (!currentUser) {
    return <div className="loading">טוען...</div>;
  }

  return (
    <div className="posts-container">
      {/* כותרת וניווט */}
      <header className="posts-header">
        <div className="header-content">
          <h1> 📰 ניהול פוסטים</h1>
          <button 
            onClick={() => navigate(`/home/users/${userId}`)} 
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
              <span>הפוסטים שלי: {posts.length}</span>
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
                  key={`post-${post.id}-${post.userId}`} 
                  className={`post-item ${selectedPost?.id === post.id ? 'selected' : ''}`}
                >
                  <div className="post-header">
                    <span className="post-id">#{post.id}</span>
                    <span className="post-user">משתמש: {post.userId}</span>
                    <span className="my-post-badge">שלי</span>
                  </div>
                  
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => handleUpdatePost(post.id, 'title', e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      marginBottom: '10px'
                    }}
                  />
                  
                  <div className="post-actions">
                    <button 
                      onClick={() => setSelectedPost(post)}
                      className="select-btn"
                    >
                      {selectedPost?.id === post.id ? 'נבחר' : 'בחר'}
                    </button>
                    
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
                      onClick={() => handleDeletePost(post.id)}
                      className="delete-btn"
                    >
                      מחק
                    </button>
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
                  <textarea
                    value={posts.find(p => p.id === selectedPost.id)?.body || ''}
                    onChange={(e) => handleUpdatePost(selectedPost.id, 'body', e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      padding: '10px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div className="post-meta">
                  <span>מזהה: {selectedPost.id}</span>
                  <span>משתמש: {selectedPost.userId}</span>
                </div>

                <div className="comments-section">
                  <div className="comments-header">
                    <button 
                      onClick={() => getComments(selectedPost.id)}
                      className="load-comments-btn"
                    >
                      {showComments ? `רענן תגובות (${comments.length})` : 'טען תגובות'}
                    </button>
                    {showComments && (
                      <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                        תגובות לפוסט #{selectedPost.id}
                      </p>
                    )}
                  </div>

                  {showComments && (
                    <>
                      {/* הוספת תגובה */}
                      <div className="add-comment">
                        <textarea
                          placeholder="הכנס תגובה חדשה..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="comment-input"
                        />
                        <button onClick={handleAddComment} className="add-comment-btn">
                          הוסף תגובה
                        </button>
                      </div>

                      {/* רשימת תגובות */}
                      <div className="comments-list">
                        <h5>תגובות ({comments.length})</h5>
                        {comments.map((comment, index) => (
                          <div key={`comment-${comment.id}-${comment.postId || selectedPost.id}-${index}`} className="comment-item">
                            <div className="comment-header">
                              <strong>{comment.name}</strong>
                              <span className="comment-email">{comment.email}</span>
                              {comment.userId === parseInt(userId) && (
                                <div className="comment-actions">
                                  <span className="my-comment">שלי</span>
                                  <button 
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="delete-comment-btn"
                                  >
                                    מחק
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="comment-body">{comment.body}</p>
                            <small style={{ color: '#999', fontSize: '12px' }}>
                              מזהה תגובה: {comment.id} | מזהה פוסט: {comment.postId || 'null'}
                            </small>
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
                <button onClick={handleAddPost} className="save-btn">שמור</button>
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