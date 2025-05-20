import { useState } from "react";
import './css/login.css'
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
    const [focusField, setFocusField] = useState(null);

const handleSubmit = () => {
    //check if password and username are good
  };

  // function func() {
  //   fetch('http://localhost:3000/users/1')
  //     .then(response => response.json())
  //     .then(json => {
  //       console.log(json);
  //       setUs(JSON.stringify(json)); // convert object to string for display
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       setUs("Error fetching data");
  //     });
  // }

  return (
    <div className="container">
      <div className="box">
        <h2 className="title">Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="username">
            Username
          </label>
          <input
            className="input"
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="input"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-password">
            <a
              href="#"
              className="forgot-link"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          <button type="submit" className="button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}



 



export default Login;