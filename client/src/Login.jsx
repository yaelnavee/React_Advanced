import { useState } from "react";

function Login() {
    const [us, setUs]=useState("nothing")
    function func(){
        const u=fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json))
setUs(u)
    }
  return (
    <>
    <>login will be here</>
    <button onClick={func}>
get
    </button>
     <div>{us}</div></>
   
  );
}


export default Login;