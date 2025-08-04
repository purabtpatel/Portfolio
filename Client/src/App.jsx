import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';  
import './App.css';
import Navbar from './Components/NavBar/NavBar';
import HomePage from './Components/HomePage/HomePage';
import AboutPage from './Components/AboutPage/AboutPage';
import ContactPage from './Components/ContactPage/ContactPage';
import ProjectPage from './Components/ProjectPage/ProjectPage';
import Footer from './Components/Footer/Footer';
import RedisTestPage from './Components/RedisTestPage/RedisTestPage';


function App() {
  return (
 
    <div className='App'>
      <Router>
        <Navbar />
        <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/redisTest" element={<RedisTestPage/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
