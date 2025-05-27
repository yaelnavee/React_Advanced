import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/signup.css';

function Signup() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("temp"));

  const [form, setForm] = useState({
    id: "",
    name: "",
    username: user.username,
    email: "",
    phone: "",
    website: user.password,
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: "",
      },
    },
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setForm((prev) => {
      const updatedForm = { ...prev };

      if (keys.length === 3) {
        const [key1, key2, key3] = keys;
        updatedForm[key1] = {
          ...prev[key1],
          [key2]: {
            ...prev[key1][key2],
            [key3]: value,
          },
        };
      } else if (keys.length === 2) {
        const [key1, key2] = keys;
        updatedForm[key1] = {
          ...prev[key1],
          [key2]: value,
        };
      } else {
        updatedForm[name] = value;
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userRes = await fetch("http://localhost:3000/users");
      const users = await userRes.json();

      const updatedForm = { ...form, id: (Number(users[users.length - 1].id) + 1).toString() };

      const postRes = await fetch(
        "http://localhost:3000/users",
        {
          method: "POST",
          body: JSON.stringify(updatedForm),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      const postResult = await postRes.json();
      console.log("Created:", postResult);
      localStorage.setItem("currentUser", JSON.stringify(postResult));
      navigate(`/home/users/${postResult.id}`);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="signup-box">
        {/* כותרת */}
        <div className="login-header">
          <h1 className="login-title">👤 השלמת הרשמה</h1>
          <p className="login-description">מלא את הפרטים שלך</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* פרטים אישיים */}
          <div className="form-section">
            <h3 className="section-title">פרטים אישיים</h3>
            
            <div className="form-group">
              <label className="form-label">שם מלא</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                className="form-input"
                placeholder="הכנס את השם המלא"
              />
            </div>

            <div className="form-group">
              <label className="form-label">שם משתמש</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="שם משתמש"
              />
            </div>

            <div className="form-group">
              <label className="form-label">אימייל</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
                type="email"
                placeholder="הכנס כתובת אימייל"
              />
            </div>

            <div className="form-group">
              <label className="form-label">טלפון</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="הכנס מספר טלפון"
              />
            </div>

            <div className="form-group">
              <label className="form-label">אתר אינטרנט</label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="כתובת אתר"
              />
            </div>
          </div>

          {/* כתובת */}
          <div className="form-section">
            <h3 className="section-title">כתובת</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">רחוב</label>
                <input
                  name="address.street"
                  value={form.address.street}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="שם הרחוב"
                />
              </div>

              <div className="form-group">
                <label className="form-label">דירה/יחידה</label>
                <input
                  name="address.suite"
                  value={form.address.suite}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="מספר דירה"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">עיר</label>
                <input
                  name="address.city"
                  value={form.address.city}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="שם העיר"
                />
              </div>

              <div className="form-group">
                <label className="form-label">מיקוד</label>
                <input
                  name="address.zipcode"
                  value={form.address.zipcode}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="מיקוד"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">קואורדינטה - רוחב</label>
                <input
                  name="address.geo.lat"
                  value={form.address.geo.lat}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="קו רוחב (אופציונלי)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">קואורדינטה - אורך</label>
                <input
                  name="address.geo.lng"
                  value={form.address.geo.lng}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="קו אורך (אופציונלי)"
                />
              </div>
            </div>
          </div>

          {/* פרטי חברה */}
          <div className="form-section">
            <h3 className="section-title">פרטי חברה (אופציונלי)</h3>
            
            <div className="form-group">
              <label className="form-label">שם החברה</label>
              <input
                name="company.name"
                value={form.company.name}
                onChange={handleChange}
                className="form-input"
                placeholder="שם החברה"
              />
            </div>

            <div className="form-group">
              <label className="form-label">סלוגן החברה</label>
              <input
                name="company.catchPhrase"
                value={form.company.catchPhrase}
                onChange={handleChange}
                className="form-input"
                placeholder="סלוגן או מטרה"
              />
            </div>

            <div className="form-group">
              <label className="form-label">תחום עסקי</label>
              <input
                name="company.bs"
                value={form.company.bs}
                onChange={handleChange}
                className="form-input"
                placeholder="תיאור התחום העסקי"
              />
            </div>
          </div>

          {/* כפתור שמירה */}
          <button type="submit" className="signup-button">
            השלם הרשמה
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;