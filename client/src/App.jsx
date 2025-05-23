import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Posts from './Posts';
import Todos from './Todos';
import Albums from './Albums';
import Signup from './Signup';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/users/:userId/todos" element={<Todos />} />
        <Route path="/albums" element={<Albums />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
