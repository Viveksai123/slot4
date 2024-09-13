import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import RulesPage from './components/Rulespage';
import LoginPage from './components/loginpage';
import Levelone from './components/Levelone';
import Leveltwo from './components/Leveltwo';
import Levelthree from './components/Levelthree';
import Levelfour from './components/Levelfour';
import Levelfive from './components/Levelfive';
import NotFoundPage from './components/NotFoundPage';
import Leaderboard from './components/Leaderboard';
import SecretCodePage from './components/SecretCodePage';
import ProtectedRoute from './components/ProtectedRoute';
import TimeUpPage from './components/TimeUpPage'; // Import the TimeUpPage component
import { FaClock, FaTrophy } from 'react-icons/fa';



import './components/styles/App.css';

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

function Layout() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTimeLeft = localStorage.getItem('timeLeft');
    return savedTimeLeft !== null ? parseInt(savedTimeLeft, 10) : 1500; // Default to 7 minutes
  });

  const [timerRunning, setTimerRunning] = useState(() => {
    const savedTimerRunning = localStorage.getItem('timerRunning');
    return savedTimerRunning !== null ? JSON.parse(savedTimerRunning) : false;
  });

  const [timerEnded, setTimerEnded] = useState(false);

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const [rollnum, setRollnum] = useState(() => {
    return localStorage.getItem('rollnum') || '';
  });

  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('score');
    return savedScore !== null ? parseInt(savedScore, 10) : 0;
  });

  const [isPopupVisible, setPopupVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - 1;
          localStorage.setItem('timeLeft', newTimeLeft);
          return newTimeLeft;
        });
      }, 1000);
    } else if (timeLeft <= 0) {
      setTimerEnded(true);
      setTimerRunning(false);
      clearLocalStorage();
      if (timer) clearInterval(timer);
      navigate('/timeup'); // Redirect to the "Time Up" page
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft, navigate]);

  const startTimer = () => {
    setTimerRunning(true);
    localStorage.setItem('timerRunning', true);
  };



  const setUserInfo = (userName, userRollnum) => {
    setUsername(userName);
    setRollnum(userRollnum);
    localStorage.setItem('username', userName);
    localStorage.setItem('rollnum', userRollnum);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('timeLeft');
    localStorage.removeItem('timerRunning');
  };

  useEffect(() => {
    localStorage.setItem('score', score);
  }, [score]);

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  const handlePopupOpen = () => {
    setPopupVisible(true);
  };

  if (timerEnded) {
    return <TimeUpPage clearLocalStorage={clearLocalStorage}  rollnum={rollnum} />;
  }

  return (
    <div>
      {location.pathname !== '/timeup' && (location.pathname !== '/' && location.pathname !== '*' && location.pathname !== '/rules'&& location.pathname !== '/leaderboard' && location.pathname !== '/home') && (
        <div className='space'>
          <div className='timer1'>
            <div className='row'>
              <FaClock className="clock-icon" />
              <p>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            </div>
          </div>
          <button onClick={handlePopupOpen} className="leaderboard-button">
            <FaTrophy /> Show Leaderboard
          </button>
        </div>
      )}

      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="leader">
            <button onClick={handlePopupClose} className="popup-close-button">Close</button>
            <Leaderboard
              username={username}
              rollnum={rollnum}
              score={score}
            />
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<SecretCodePage />} />
        
        <Route 
          path="/home" 
          element={
            <ProtectedRoute 
              element={<HomePage />} 
            />
          } 
        />
        <Route 
          path="/login" 
          element={<ProtectedRoute element={<LoginPage startTimer={startTimer} setUserInfo={setUserInfo} />} />}
        />
        <Route 
          path="/rules" 
          element={
            <ProtectedRoute 
              element={<RulesPage />} 
            />
          } 
        />
        <Route 
          path="/level1" 
          element={
            <ProtectedRoute 
              element={
                <Levelone 
                  username={username} 
                  rollnum={rollnum} 
                  timeLeft={timeLeft} 
                  score={score} 
                  setScore={setScore} 
                />
              } 
            />
          } 
        />
        <Route 
          path="/level2" 
          element={
            <ProtectedRoute 
              element={
                <Leveltwo 
                  username={username} 
                  rollnum={rollnum} 
                  timeLeft={timeLeft} 
                  score={score} 
                  setScore={setScore} 
                />
              } 
            />
          } 
        />
        <Route 
          path="/level3" 
          element={
            <ProtectedRoute 
              element={
                <Levelthree 
                  username={username} 
                  rollnum={rollnum} 
                  timeLeft={timeLeft} 
                  score={score} 
                  setScore={setScore} 
                />
              } 
            />
          } 
        />
        <Route 
          path="/level4" 
          element={
            <ProtectedRoute 
              element={
                <Levelfour 
                  username={username} 
                  rollnum={rollnum} 
                  timeLeft={timeLeft} 
                  score={score} 
                  setScore={setScore} 
                />
              } 
            />
          } 
        />
        <Route 
          path="/level5" 
          element={
            <ProtectedRoute 
              element={
                <Levelfive 
                  username={username} 
                  rollnum={rollnum} 
                  timeLeft={timeLeft} 
                  score={score} 
                  setScore={setScore} 
                />
              } 
            />
          } 
        />
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute 
              element={
                <Leaderboard 
                  username={username} 
                  rollnum={rollnum} 
                  score={score} 
                />
              } 
            />
          } 
        />
        <Route 
          path="/timeup" 
          element={
            <TimeUpPage 
              clearLocalStorage={clearLocalStorage} // Pass the clearLocalStorage function to TimeUpPage
              rollnum={rollnum} 
              username={username} 
            />
          } 
        />
           <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;