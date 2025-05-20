import { useState } from "react";

function Login() {
  const [us, setUs] = useState("nothing");

  function func() {
    fetch('http://localhost:3000/users/1')
      .then(response => response.json())
      .then(json => {
        console.log(json);
        setUs(JSON.stringify(json)); // convert object to string for display
      })
      .catch(err => {
        console.error(err);
        setUs("Error fetching data");
      });
  }

  return (
    <>
      <>login will be here</>
      <button onClick={func}>get</button>
      <div>{us}</div>
    </>
  );
}



export default Login;