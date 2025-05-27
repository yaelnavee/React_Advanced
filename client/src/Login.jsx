import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './css/login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetch(`http://localhost:3000/users?username=${username}&website=${password}`);
    const users = await result.json();
    if(users.length == 0){
      setError("Username or password are incorrect");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(users[0]));
    navigate(`/home/users/${users[0].id}`);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* כותרת */}
        <div className="login-header">
          <h1 className="login-title">🔐 התחברות</h1>
          <p className="login-description">היכנס לחשבון שלך</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* שדה שם משתמש */}
          <div className="form-group">
            <label className="form-label">שם משתמש</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="הכנס את שם המשתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* שדה סיסמה */}
          <div className="form-group">
            <label className="form-label">סיסמה</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="הכנס את הסיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* הודעת שגיאה */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* כפתור התחברות */}
          <button type="submit" className="login-button">
            התחבר
          </button>

          {/* קישור לרישום */}
          <div className="register-link-section">
            <Link to="/register" className="register-link">
              אין לך חשבון? הירשם כאן
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;