import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './App.css';

const TransferFunds = () => {
  const [recipientPhone, setRecipientPhone] = useState('');
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

  const handleTransfer = async (event) => {
    event.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !/^\d+(\.\d{1,2})?$/.test(amount)) {
      setMessage('Please enter a valid amount with up to two decimal places.');
      return;
    }

    const senderAccountId = localStorage.getItem('accountID'); // Fetch dynamically from localStorage
    const response = await api.post('/transfer', { senderAccountId, recipientPhone, amount: parsedAmount.toFixed(2) });

    setMessage(response.data.message);
  };
    
  return (
    <div>
      <h2>Transfer Funds</h2>
      <h3>Current Balance: R{balance}</h3>
      <form onSubmit={handleTransfer}>
        <div>
          <label>Recipient Phone</label>
          <input
            type="text"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0.00"
          />
        </div>
        <button type="submit">Transfer</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default TransferFunds;
