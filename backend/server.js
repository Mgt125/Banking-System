const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sign-up endpoint
app.post('/deposit', async (req, res) => {
  const { amount, accountId } = req.body;

  if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
  }

  // Ensure amount is a valid decimal with 2 decimal places
  const parsedAmount = parseFloat(amount);
  if (!isFinite(parsedAmount) || (parsedAmount * 100) % 1 !== 0) {
      return res.status(400).json({ message: 'Amount must be a valid number with at most two decimal places.' });
  }

  // Get the current balance
  db.query('SELECT AccountBalance FROM Account WHERE AccountID = ?', [accountId], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'Account not found' });
      }

      const currentBalance = results[0].AccountBalance;
      const newBalance = (parseFloat(currentBalance) + parsedAmount).toFixed(2); // Keep 2 decimal places

      // Update the balance
      db.query('UPDATE Account SET AccountBalance = ? WHERE AccountID = ?', [newBalance, accountId], (err) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Server error' });
          }

          // Log the transaction
          const transactionQuery = 'INSERT INTO Transaction (TransactionType, TransactionAmount, TransactionDate, AccountID) VALUES (?, ?, NOW(), ?)';
          db.query(transactionQuery, ['Deposit', parsedAmount, accountId], (err) => {
              if (err) {
                  console.error(err);
              }
              res.status(200).json({ message: 'Deposit successful', newBalance });
          });
      });
  });
});


//Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  db.query('SELECT * FROM Customer WHERE CustomerEmail = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Debugging: Check if the stored password is being retrieved correctly
    console.log('Retrieved User Data:', user);

    // Assuming your database has a column called "CustomerPassword" for the hashed password
    const hashedPassword = user.CustomerPassword;

    // Compare the provided password with the stored hashed password
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Retrieve the AccountID using the CustomerID
      db.query('SELECT AccountID FROM Account WHERE CustomerID = ?', [user.CustomerID], (err, accountResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        if (accountResults.length === 0) {
          return res.status(404).json({ message: 'Account not found' });
        }

        const accountID = accountResults[0].AccountID;

        // Password is correct, return the customerID and accountID
        res.status(200).json({
          message: 'Login successful',
          customerID: user.CustomerID,
          accountID: accountID
        });
      });
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      return res.status(500).json({ message: 'Server error' });
    }
  });
});

//Deposit endpoint
app.post('/deposit', async (req, res) => {
  const { amount, accountId } = req.body;

  if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
  }

  // Ensure amount is a valid decimal with 2 decimal places
  const parsedAmount = parseFloat(amount);
  if (!isFinite(parsedAmount) || (parsedAmount * 100) % 1 !== 0) {
      return res.status(400).json({ message: 'Amount must be a valid number with at most two decimal places.' });
  }

  // Get the current balance
  db.query('SELECT AccountBalance FROM Account WHERE AccountID = ?', [accountId], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'Account not found' });
      }

      const currentBalance = results[0].AccountBalance;
      const newBalance = (parseFloat(currentBalance) + parsedAmount).toFixed(2); // Keep 2 decimal places

      // Update the balance
      db.query('UPDATE Account SET AccountBalance = ? WHERE AccountID = ?', [newBalance, accountId], (err) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Server error' });
          }

          // Log the transaction
          const transactionQuery = 'INSERT INTO Transaction (TransactionType, TransactionAmount, TransactionDate, AccountID) VALUES (?, ?, NOW(), ?)';
          db.query(transactionQuery, ['Deposit', parsedAmount, accountId], (err) => {
              if (err) {
                  console.error(err);
              }
              res.status(200).json({ message: 'Deposit successful', newBalance });
          });
      });
  });
});


app.post('/withdraw', async (req, res) => {
  const { amount, accountId } = req.body;

  if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
  }

  const parsedAmount = parseFloat(amount);
  if (!isFinite(parsedAmount) || (parsedAmount * 100) % 1 !== 0) {
      return res.status(400).json({ message: 'Amount must be a valid number with at most two decimal places.' });
  }

  // Query to get the current balance from the Account table
  const queryBalance = 'SELECT AccountBalance FROM Account WHERE AccountID = ?';

  db.query(queryBalance, [accountId], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'Account not found' });
      }

      const currentBalance = results[0].AccountBalance;

      // Check if there are sufficient funds
      if (currentBalance < parsedAmount) {
          return res.status(400).json({ message: 'Insufficient funds' });
      }

      const newBalance = (currentBalance - parsedAmount).toFixed(2); // Keep 2 decimal places

      // Update the balance in the database
      const updateBalance = 'UPDATE Account SET AccountBalance = ? WHERE AccountID = ?';
      db.query(updateBalance, [newBalance, accountId], (err) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Server error' });
          }

          // Log the transaction in the Transaction table
          const transactionQuery = 'INSERT INTO Transaction (TransactionType, TransactionAmount, TransactionDate, AccountID) VALUES (?, ?, NOW(), ?)';
          db.query(transactionQuery, ['Withdrawal', parsedAmount, accountId], (err) => {
              if (err) {
                  console.error(err);
              }
              res.status(200).json({ message: 'Withdrawal successful', newBalance });
          });
      });
  });
});


// Fund Transfer endpoint
app.post('/transfer', async (req, res) => {
  const { senderAccountId, recipientPhone, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer amount' });
  }

  // Find the recipient account by phone number
  db.query('SELECT AccountID, AccountBalance FROM Account WHERE CustomerPhone = ?', [recipientPhone], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Recipient account not found' });
    }

    const recipientAccountId = results[0].AccountID;
    const recipientBalance = results[0].AccountBalance;

    // Check sender balance and proceed with transfer
    db.query('SELECT AccountBalance FROM Account WHERE AccountID = ?', [senderAccountId], (err, senderResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (senderResults.length === 0) {
        return res.status(404).json({ message: 'Sender account not found' });
      }

      const senderBalance = senderResults[0].AccountBalance;

      if (senderBalance < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }

      const newSenderBalance = senderBalance - amount;
      const newRecipientBalance = recipientBalance + amount;

      // Start transaction
      db.beginTransaction((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
        }

        // Update sender's balance
        db.query('UPDATE Account SET AccountBalance = ? WHERE AccountID = ?', [newSenderBalance, senderAccountId], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error(err);
              res.status(500).json({ message: 'Server error' });
            });
          }

          // Log sender's debit transaction
          const debitTransactionQuery = 'INSERT INTO Transaction (TransactionType, TransactionAmount, TransactionDate, AccountID) VALUES (?, ?, NOW(), ?)';
          db.query(debitTransactionQuery, ['Transfer Debit', amount, senderAccountId], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
              });
            }

            // Update recipient's balance
            db.query('UPDATE Account SET AccountBalance = ? WHERE AccountID = ?', [newRecipientBalance, recipientAccountId], (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error(err);
                  res.status(500).json({ message: 'Server error' });
                });
              }

              // Log recipient's credit transaction
              const creditTransactionQuery = 'INSERT INTO Transaction (TransactionType, TransactionAmount, TransactionDate, AccountID) VALUES (?, ?, NOW(), ?)';
              db.query(creditTransactionQuery, ['Transfer Credit', amount, recipientAccountId], (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error(err);
                    res.status(500).json({ message: 'Server error' });
                  });
                }

                // Commit transaction
                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error(err);
                      res.status(500).json({ message: 'Server error' });
                    });
                  }

                  res.status(200).json({ message: 'Transfer successful' });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Transaction history endpoint
app.get('/transaction-history/:accountId', async (req, res) => {
    const { accountId } = req.params;

    const transactionQuery = 'SELECT TransactionType, TransactionAmount, TransactionDate FROM Transaction WHERE AccountID = ? ORDER BY TransactionDate DESC';
    db.query(transactionQuery, [accountId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        res.status(200).json(results);
    });
});

app.get('/balance/:accountID', (req, res) => {
  const accountID = req.params.accountID;

  db.query('SELECT AccountBalance FROM Account WHERE AccountID = ?', [accountID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({ balance: results[0].AccountBalance });
  });
});

// Start the server using the PORT variable
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
