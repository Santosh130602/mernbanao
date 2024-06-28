import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login'
import Signup from './components/SignUp'
import Posts from './components/Posts';
import Navbar from './components/Navbar';



function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/posts' element={<Posts />} />
      </Routes>
     </BrowserRouter>
    </>
  );
}

export default App;