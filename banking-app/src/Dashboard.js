// Dashboard Component
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './App.css';

const Dashboard = () => {
  const [balance, setBalance] = useState(0.0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Get the accountID from localStorage
  const accountID = localStorage.getItem('accountID');

  useEffect(() => {
    const fetchBalance = async () => {
      if (!accountID) {
        setMessage('Account not found');
        return;
      }

      try {
        const response = await api.get(`/balance/${accountID}`);
        setBalance(response.data.balance);
      } catch (error) {
        setMessage('Failed to fetch balance');
      }
    };

    fetchBalance();
  }, [accountID]);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Current Balance: R{balance}</h3>
        {message && <p>{message}</p>}
      </div>
      <div>
        <button onClick={() => navigate('/deposit')}>Deposit</button>
        <button onClick={() => navigate('/withdrawal')}>Withdrawal</button>
        <button onClick={() => navigate('/fund-transfer')}>Fund Transfer</button>
        <button onClick={() => navigate('/transaction-history')}>Transaction History</button>
      </div>
    </div>
  );
};

export default Dashboard;
