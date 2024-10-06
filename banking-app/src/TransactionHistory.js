import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './App.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
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

    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/transaction-history/${accountID}`);
        setTransactions(response.data);
      } catch (error) {
        setMessage(error.response.data.message);
      }
    };

    fetchBalance();
    fetchTransactions();
  }, [accountID]);

  return (
    <div className="transaction-history">
      <h2 style={{ marginTop: '50px' }}>Transaction History</h2> {/* Adjust margin as needed */}
      <h3>Current Balance: R{balance}</h3>
      {message && <p>{message}</p>}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      {transactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>Transaction Amount</th>
              <th>Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.TransactionType}</td>
                <td>R{transaction.TransactionAmount}</td>
                <td>{new Date(transaction.TransactionDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionHistory;
