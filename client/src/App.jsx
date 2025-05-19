import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Posts from './Posts';
import Todos from './Todos';
import Albums from './Albums';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/albums" element={<Albums />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
