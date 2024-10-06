import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(0.0);
  const navigate = useNavigate();

  const accountID = localStorage.getItem('accountID');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get(`/balance/${accountID}`);
        setBalance(response.data.balance);
      } catch (error) {
        setMessage('Failed to fetch balance');
      }
    };

    fetchBalance();
  }, [accountID]);

  const handleDeposit = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !/^\d+(\.\d{1,2})?$/.test(amount)) {
      setMessage('Please enter a valid amount with up to two decimal places.');
      return;
    }

    try {
      const response = await api.post('/deposit', { amount: parsedAmount.toFixed(2), accountId: accountID });
      setMessage(`Deposit successful! New Balance: R${response.data.newBalance}`);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Deposit</h2>
      <h3>Current Balance: R{balance}</h3>
      <form onSubmit={handleDeposit}>
        <label>Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          placeholder="0.00"
        />
        <button type="submit">Deposit</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default Deposit;
