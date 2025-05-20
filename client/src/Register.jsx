
import { useState } from "react";
import './css/login.css'
import { useNavigate } from 'react-router-dom';


function Register() {
    const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [error, setError]=useState("")

const handleSubmit = async (event) => {
  event.preventDefault() 
  if(username=="" || password==""||verify==""){
    setError("Fields cannot be empty")
    return
  }
    if(verify!=password){
         setError("Error in typing password")

return
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
      localStorage.setItem("temp", JSON.stringify({username: username, password: password}))
      console.log("success");
      navigate('/signup') 
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
  };

  return (
    <div className="container">
      <div className="box">
        <h2 className="title">Register</h2>
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
          <label className="label" htmlFor="verify">
            Verify Password
          </label>
          <input
            className="input"
            type="password"
            id="verify"
            name="verify"
            placeholder="Retype your password"
            value={verify}
            onChange={(e) => setVerify(e.target.value)}
            required
          />
          <div className="forgot-password">
           {error}
          </div>


          <button type="submit" className="button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}



 



export default Register;