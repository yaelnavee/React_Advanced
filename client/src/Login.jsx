import { useState } from "react";
import './css/login.css'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Login() {
  const navigate=useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]=useState("")

const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await fetch(`http://localhost:3000/users?username=${username}&website=${password}`);
    const users = await result.json();
    if(users.length==0){
      setError("Username or password are incorrect")
      return
    }
    localStorage.setItem("currentUser", JSON.stringify(users[0]))
    navigate(`/home/users/${users[0].id}`)
  };


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

           <div className="error">
           {error}
          </div>

          <button type="submit" className="button">
            Log In
          </button>
<div className="link-wrapper">
  <Link to="/register" className="switchlink">Don't have an account? Register</Link>
</div>

        </form>
      </div>
    </div>
  );
}



 



export default Login;