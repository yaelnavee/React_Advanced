import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './css/login.css';

function Register() {
    const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (event) => {
  event.preventDefault();
  if(username=="" || password==""||verify==""){
    setError("Fields cannot be empty");
    return;
  }
    if(verify!=password){
         setError("Error in typing password");
return;
    }
  let found = false;

  try {
    const nameRes = await fetch(`http://localhost:3000/users?username=${username}`);
    const nameJson = await nameRes.json();
    if (nameJson.length !== 0) {
      found = true;
    }

    const passRes = await fetch(`http://localhost:3000/users?website=${password}`);
    const passJson = await passRes.json();
    if (passJson.length !== 0) {
      found = true;
    }

    if (found) {
      setError("Username or password already exists");
    } else {
      localStorage.setItem("temp", JSON.stringify({username: username, password: password}));
      console.log("success");
      navigate('/signup');
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
  };

  return (
    <div className="login-container">
      <div className="login-box register-box">
        {/* כותרת */}
        <div className="login-header">
          <h1 className="login-title">📝 הרשמה</h1>
          <p className="login-description">צור חשבון חדש</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* שדה שם משתמש */}
          <div className="form-group">
            <label className="form-label">שם משתמש</label>
            <input
              className="form-input"
              type="text"
              id="username"
              name="username"
              placeholder="הכנס שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* שדה סיסמה */}
          <div className="form-group">
            <label className="form-label">סיסמה</label>
            <input
              className="form-input"
              type="password"
              id="password"
              name="password"
              placeholder="הכנס סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* שדה אימות סיסמה */}
          <div className="form-group">
            <label className="form-label">אימות סיסמה</label>
            <input
              className="form-input"
              type="password"
              id="verify"
              name="verify"
              placeholder="הכנס את הסיסמה שוב"
              value={verify}
              onChange={(e) => setVerify(e.target.value)}
              required
            />
          </div>

          {/* הודעת שגיאה */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* כפתור הרשמה */}
          <button type="submit" className="login-button register-button">
            הירשם
          </button>

          {/* קישור להתחברות */}
          <div className="register-link-section">
            <Link to="/" className="register-link">
              יש לך כבר חשבון? התחבר כאן
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;