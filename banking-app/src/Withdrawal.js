import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Withdrawal = () => {
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

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !/^\d+(\.\d{1,2})?$/.test(amount)) {
      setMessage('Please enter a valid amount with up to two decimal places.');
      return;
    }

    const accountID = localStorage.getItem('accountID');
    try {
      const response = await api.post('/withdraw', { amount: parsedAmount.toFixed(2), accountId: accountID });
      setMessage(`Withdrawal successful! New Balance: R${response.data.newBalance}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred during the withdrawal process.');
    }
  };

  return (
    <div>
      <h2>Withdrawal</h2>
      <h3>Current Balance: R{balance}</h3>
      <form onSubmit={handleWithdrawal}>
        <label>Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          placeholder="0.00"
        />
        <button type="submit">Withdraw</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default Withdrawal;
