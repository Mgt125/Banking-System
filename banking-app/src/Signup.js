import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; // Ensure this connects to your backend API
import './App.css';

const Signup = () => {
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/signup', { 
        userFirstName, 
        userLastName, 
        phone, 
        email, 
        dateOfBirth, 
        password 
      });

      // Extract customerID and accountID from the response
      const { customerID, accountID, message } = response.data;

      // Store the customerID and accountID in localStorage for later use
      localStorage.setItem('customerID', customerID);
      localStorage.setItem('accountID', accountID);

      setMessage(message);

      // Navigate to the dashboard or login page after successful signup
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Show the error message from the backend
        setMessage(error.response.data.message);
      } else {
        setMessage('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input 
            type="text" 
            value={userFirstName} 
            onChange={(e) => setUserFirstName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Last Name</label>
          <input 
            type="text" 
            value={userLastName} 
            onChange={(e) => setUserLastName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Phone</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Date of Birth</label>
          <input 
            type="date" 
            value={dateOfBirth} 
            onChange={(e) => setDateOfBirth(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Sign Up</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
