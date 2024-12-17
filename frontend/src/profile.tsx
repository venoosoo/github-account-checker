import React, { useState, useEffect } from 'react';
import "./profile.css";

const Profile: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [redMessage, setRedMessage] = useState<string>('Please log in');
  // On component mount, check if the user is already logged in
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLogin(event.target.value);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const handleRegister = async () => {
    try {
      const response = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });
      const data = await response.json();
      console.log(data)
      if (data.ok) {
        localStorage.setItem('user_id', data.user_id)
        localStorage.setItem('name', login)
        setRedMessage("Registration successful!");
        setIsLoggedIn(true);
        console.log(localStorage)
      } else {
        setRedMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      setRedMessage("Error: Unable to register.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }), 
      });
  
      const data = await response.json(); 
      console.log(data)
      if (data.ok) {
        setIsLoggedIn(true);
        localStorage.setItem('user_id', data.user_id); 
        localStorage.setItem('name', data.login)
      } else {
        setRedMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setRedMessage("Error: Unable to log in.");
    }
  };

  const handleIconClick = () => {
    setShowPassword(!showPassword);
  };

  // Log out the user and clear their session
  const handleLogout = () => {
    localStorage.removeItem('user_id');
    setIsLoggedIn(false);
    setRedMessage("Please log in");
  };

  return (
    <div className='prof'>
      <h1 className='prof-page'>Profile Page</h1>
      {isLoggedIn ? (
        <div className='welcome-user'>
          <p className='welcome-user-text'>Hi, {localStorage.getItem('name')}</p>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div className='log-in'>
          <div className="input-wrapper">
            <input
              onChange={handleLoginChange}
              value={login}
              className='username'
              placeholder='Username'
            />
          </div>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              onChange={handlePasswordChange}
              value={password}
              className='password'
              placeholder='Password'
            />
            <button
              className="icon-button"
              onClick={handleIconClick}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
          <p className='log-in-text'>{redMessage}</p>
          <div className='buttons'>
            <button onClick={handleRegister} className='reg-button'>Register</button>
            <button onClick={handleLogin} className='log-button'>Log in</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
