import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';  
import { useEffect } from 'react';
import './App.css';
import Navbar from './Components/NavBar/NavBar';
import HomePage from './Components/HomePage/HomePage';
import AboutPage from './Components/AboutPage/AboutPage';
import ProjectPage from './Components/ProjectPage/ProjectPage';
import Footer from './Components/Footer/Footer';
import RedisTestPage from './Components/RedisTestPage/RedisTestPage';


function App() {
  const uri = import.meta.env.VITE_API_URL;
  const fetchUrl = `${uri}track`;

  useEffect(() => {
    fetch(fetchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  }, []);

  return (
 
    <div className='App'>
      <Router>
        <Navbar />
        <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectPage />} />
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
