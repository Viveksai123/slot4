import React, { useState } from 'react';
import './styles/App.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ startTimer, setUserInfo }) => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [key, setKey] = useState(''); // State for the key input
  const [nameError, setNameError] = useState(''); // State to hold validation error message for name
  const [rollNoError, setRollNoError] = useState(''); // State to hold validation error message for roll number
  const [keyError, setKeyError] = useState(''); // State to hold validation error message for key
  const [isRollNoExists, setIsRollNoExists] = useState(false); // State to track if roll number exists
  const [isKeyRequested, setIsKeyRequested] = useState(false); // State to track if key input is needed
  const navigate = useNavigate(); // Use navigate instead of history

  const validateName = (name) => {
    const namePattern = /^[A-Za-z\s]{3,}$/; // Regex pattern for name: at least 3 letters, allows spaces, but no special characters
    if (!namePattern.test(name)) {
      return "Name must be at least 3 characters long, can include spaces, and contain only alphabets.";
    }
    return "";
  };

  const validateRollNo = (rollNo) => {
    const rollNoPatterns = [
      /^1601\d{8}$/,  // Pattern for roll numbers starting with 1601 and followed by 8 digits
      /^\d{7,12}$/   // Pattern for roll numbers of 7 to 12 digits
    ];

    if (!rollNoPatterns.some(pattern => pattern.test(rollNo))) {
      return "Roll No must match one of the valid formats: 1601 followed by 8 digits or 7 to 12 digits.";
    }
    return "";
  };

  const validateKey = (key) => {
    // Replace 'SECRET_KEY' with the actual key you want to validate against
    const expectedKey = 'lastchance'; 
    if (key !== expectedKey) {
      return "Incorrect key. Please try again.";
    }
    return "";
  };

  const checkRollNoExists = async (rollNo) => {
    try {
      const response = await fetch(`https://json-production-4a9d.up.railway.app/books?rollnum=${rollNo}`);
      const data = await response.json();
      return data.length > 0; // Returns true if roll number already exists
    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const nameValidationError = validateName(name);
    const rollNoValidationError = validateRollNo(rollNo);

    if (nameValidationError || rollNoValidationError) {
      setNameError(nameValidationError);
      setRollNoError(rollNoValidationError);
      return;
    }

    if (name && rollNo) {
      if (await checkRollNoExists(rollNo)) {
        setIsRollNoExists(true); // Roll number exists, show key input field
        setIsKeyRequested(true); // Set key input requested
      } else {
        // Roll number does not exist, submit user data
        await submitUserData();
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleKeyValidation = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const keyValidationError = validateKey(key);
    if (keyValidationError) {
      setKeyError(keyValidationError);
      return;
    }

    // Proceed with navigation after key validation
    setUserInfo(name, rollNo);
    startTimer(); // Start the timer after successful key validation
    navigate('/level1');
  };

  const submitUserData = async () => {
    const userData = { username: name, rollnum: rollNo, level: 0, timeLeft: 0, score: 0,};
    try {
      const response = await fetch('https://json-production-4a9d.up.railway.app/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User data sent:', data);
        setUserInfo(name, rollNo);
        startTimer(); // Start the timer after successful response
        navigate('/level1');
      } else {
        console.error('Failed to send user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending user data:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image animate__animated"></div>
        <div className="login-form">
          <h2 className="text-2xl font-bold mb-4 animate__animated animate__fadeInLeft">Enter Your Details</h2>
          <form onSubmit={isKeyRequested ? handleKeyValidation : handleSubmit}>
            <div className="mb-4 animate__animated animate__backInDown">
              <label htmlFor="name" className="block text-lg font-medium">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-2 border rounded-md" 
                placeholder="Your Name" 
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(''); // Clear error message when user modifies the input
                }}
              />
              {nameError && <p className="text-red-500">{nameError}</p>}
            </div>
            <div className="mb-4 animate__animated animate__backInDown">
              <label htmlFor="roll-no" className="block text-lg font-medium">Roll No</label>
              <input 
                type="text" 
                id="roll-no" 
                className="w-full px-4 py-2 border rounded-md" 
                placeholder="Your Roll No"
                value={rollNo}
                onChange={(e) => {
                  setRollNo(e.target.value);
                  setRollNoError('');
                  setIsRollNoExists(false); // Reset roll number existence check when user changes input
                  setIsKeyRequested(false); // Reset key request state
                }}
              />
              {rollNoError && <p className="text-red-500">{rollNoError}</p>}
            </div>
            {isRollNoExists && (
              <div className="mb-4 animate__animated animate__backInDown">
                <label htmlFor="key" className="block text-lg font-medium">Key</label>
                <input 
                  type="text" 
                  id="key" 
                  className="w-full px-4 py-2 border rounded-md" 
                  placeholder="Enter Key"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setKeyError(''); // Clear error message when user modifies the input
                  }}
                />
                {keyError && <p className="text-red-500">{keyError}</p>}
              </div>
            )}
            <div className="row">
              <button 
                type="submit" 
                className="w-full px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-700 transition duration-300 animate__animated animate__fadeInUpBig"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
