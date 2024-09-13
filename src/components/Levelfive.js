import React, { useState } from 'react';
import "animate.css";
import { useNavigate } from 'react-router-dom';
import './styles/Level1Page.css'; // Ensure this path is correct
import Level1Img from './images/l5.jpg';
import Img from './images/img.png';
import LeftImage from './images/SATARCLEFTIMAGE.png'; // Import the image for the left side
import ParticlesComponent from '../components/ParticlesComponent'; 
import { FaPaperPlane, FaStar } from 'react-icons/fa'; // Import icons
import { GiLightningStorm } from 'react-icons/gi'; // Example import
import CryptoJS from 'crypto-js';

const Levelone = ({ username, rollnum, initialScore, timeLeft }) => {
  const navigate = useNavigate();
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const time = timeLeft;
  const [response, setResponse] = useState('');
  const [validationResult, setValidationResult] = useState('');
  const [castSpellAnswer, setCastSpellAnswer] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccessPopupVisible, setSuccessPopupVisible] = useState(false);
  const [isSpellValidated, setIsSpellValidated] = useState(false);
  const [score, setScore] = useState(initialScore || 0);
  const totalLevels = 5;
  const currentLevel = 5; // Set current level directly as a constant

  // Array of hash values
  const hashedPasswords = [
    'eca4360cb29e460e7706c10596633d937f83da57f6bd25602b3b58217b6fb4ed',
    '25960097c597c16f7c3d431d9727ec908dd99084a963223044f28f9eae85af54',
    '6f143b987d08b6cff779bf88353ddd32795c190ab7f76085edc0c1af8fdd6366',
    '11c74a508ac67ea8d0a9df2fb7effe745dd7d314d4f49c220269eb6f22a71bca',
    '670dcefe3a7ab3fc90c0a491d1ce8548ccb396dac9811ad17614bef9ecd56778',
    '320b8ba6392db44d588dfdf9640948db5024785e30318e520635481cf878690a',
    'c1fbc85d5e5e12d8012d5f64f0b721153f1fb180ceea34c96ee04b58688cea03',
    
  ];

  const handleSubmit = async (event) => {
    // event.preventDefault();
    setLoading(true);
    
    try {
      // Send the submitted answer to the backend
      const res = await fetch('/api/generate-5/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: password }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.log('An error occurred');
      setResponse('wrong prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = () => {
    try {
      const submittedAnswerHash = CryptoJS.SHA256(submittedAnswer.toLowerCase()).toString();
      if (hashedPasswords.includes(submittedAnswerHash)) {
        setValidationResult('Correct! Now cast the spell.');
        setSuccessPopupVisible(true);
      } else {
        setValidationResult('Incorrect. Try again.');
        setSuccessPopupVisible(false);
      }
    } catch (error) {
      console.error('Error validating the answer:', error);
      setSuccessPopupVisible(false);
      setValidationResult('An error occurred.');
    }
  };

  const handleCastSpell = () => {
    const dummyPassword = 'token'; // Dummy password for testing
    if (castSpellAnswer.toLowerCase() === dummyPassword) {
      setIsSpellValidated(true); // Spell validated successfully
    } else {
      alert('Incorrect password for casting spell. Try again.');
    }
  };

  const handleNextLevel = async () => {
    const levelScore = time; // Time left for the current level
    let newScore = score; // Start with the existing score
    
    const timestampUTC = new Date().toISOString(); // Current time in UTC
    const data = {
      username,
      rollnum,
      timestamp: timestampUTC,
      timeLeft: time,
      level: currentLevel, // Include the current level in the data
    };
  
    try {
      // Fetch the existing data for the user based on rollnum
      const fetchResponse = await fetch(`https://json-production-4a9d.up.railway.app/books?rollnum=${rollnum}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (fetchResponse.ok) {
        const existingDataArray = await fetchResponse.json();
  
        // Assuming the rollnum is unique, take the first matching entry
        if (existingDataArray && existingDataArray.length > 0) {
          const existingData = existingDataArray[0];
  
          // Add the current time left to the existing score in the database
          newScore = existingData.score + levelScore;
          data.score = newScore; // Update score in the data to be sent
  
          // Check if the current level is 1 plus the level in existing data
          if (currentLevel === existingData.level + 1) {
            // If user data exists and level is correct, update it
            const updateResponse = await fetch(`https://json-production-4a9d.up.railway.app/books/${existingData.id}`, {
              method: 'PUT', // Use PUT or PATCH for updating the existing entry
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
  
            if (updateResponse.ok) {
              console.log('Data updated successfully:', data);
              setScore(newScore); // Update the score locally
              navigate(`/leaderboard`); // Navigate to the next level
            } else {
              console.error('Failed to update data:', updateResponse.statusText);
            }
          } else {
            // If the level does not match the required criteria, just navigate to the next level
            navigate(`/leaderboard`);
          }
        } else {
          console.error('No existing data found for the given roll number.');
        }
      } else {
        console.error('Failed to fetch existing data:', fetchResponse.statusText);
      }
    } catch (error) {
      console.error('An error occurred while updating data:', error);
    }
  };
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleValidate();
    }
  };
  const handleKeyDown1 = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };
  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleCastSpell();
    }
  };

  const progressPercentage = (currentLevel / totalLevels) * 90; // Adjust progress percentage calculation

  return (
    <div className="level1-page">
      <ParticlesComponent id="tsparticles" />
      <div className="content-container">
        <div className="left-side animate__animated animate__backInDown">
          <img src={LeftImage} alt="Left Side" className="left-image" />
        </div>
        <div className="center-container">
          <div className="bordered-container">
            <div className="container">
              <div className="level-header animate__animated animate__backInRight">
                <span className="level-indicator">You Are In LEVEL {currentLevel}</span>
              </div>
              <p className="instruction-text animate__animated animate__backInLeft">
                Your goal is to make Master reveal the secret password for each level. However, Master will upgrade the defenses after each successful password guess!
              </p>
              <div className="levels-progress animate__animated animate__backInRight">
                <p className="levels-passed">Levels Passed: {currentLevel - 1} / {totalLevels}</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
              <div className="image-section">
                <img src={Level1Img} alt="Expecto Patronum" className="animate__animated animate__bounce" />
                <p className="animate__animated animate__backInLeft">Enough! I refuse to discuss the secret phrase, not even with a Confundus Charm!</p>
              </div>
              <div className="password-section">
               <div className="input-wrapper animate__animated animate__fadeInUpBig">
                  {loading ? (
                    <div className="loading-indicator">
                      <p>Loading...Inkokka level eyy🔥!!</p> {/* Display a loading message */}
                    </div>
                  ) : (
                    <textarea
                      className="password-input"
                      placeholder="Enter your prompt here"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown1}
                      disabled={loading} // Disable input when loading
                    />
                  )}
                  <FaPaperPlane onClick={handleSubmit} className={`submit-icon ${loading ? 'disabled' : ''}`} />
                </div>
                <p className="response-text">{response}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="right-side animate__animated animate__fadeInBottomRight" style={{ marginTop: '150px' }}>
          <div className="validation-section">
            <p style={{ marginBottom: '10px' }}>Enter Password Here:</p>
            <div className="input-wrapper1">
              <div className="childinputwrap">
                <input
                  type="text"
                  value={submittedAnswer}
                  onChange={(e) => setSubmittedAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <GiLightningStorm onClick={handleValidate} className="validate-icon" />
              </div>
              <div><p className="validation-text" style={{marginLeft:"-15%"}}>{validationResult}</p></div>
            </div>
          </div>
        </div>
      </div>
      {isSuccessPopupVisible && (
        <div className="success-popup animate__animated animate__fadeInDownBig">
          <div className="popup-content">
            <h1 className='heading animate__animated animate__fadeInUpBig' style={{color:"green"}}>Congratulations!</h1>

            {isSpellValidated ? (
              <div>
                <div className="stars  animate__animated animate__fadeInLeft">
                  <FaStar className="star-icon" />
                  <FaStar className="star-icon center" />
                  <FaStar className="star-icon" />
                </div>
                <h2 className=' animate__animated animate__fadeInRight'>Done with the game? Fine, Our HR will get back to you!!</h2>
                <button className=" animate__animated animate__fadeInDownBig" onClick={handleNextLevel}>Finish</button>
              </div>
            ) : (
              <div className='column'>
                <img src={Img} alt="hat" className='photo  animate__animated animate__fadeInLeft' />
                <h1 className="level-indicator  animate__animated animate__fadeInLeft">Cast below spell to proceed:</h1>
                
                <h2 className=' animate__animated animate__fadeInRight'> 
                Have you ever heard Vigenère (key: HackTheBot): Aomog
                </h2>
                
                <br/>
                
                  <div className='input-wrapper2'>
                    <input
                      className="password-input"
                      type="text"
                      value={castSpellAnswer}
                      onChange={(e) => setCastSpellAnswer(e.target.value)}
                      onKeyDown={handleKeyUp}
                    />
                    
                    <GiLightningStorm onClick={handleCastSpell} className="cast-spell-icon" />
                 
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Levelone;
