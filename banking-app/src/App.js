import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
import Deposit from './Deposit';
import Withdrawal from './Withdrawal';
import FundTransfer from './FundTransfer';
import TransactionHistory from './TransactionHistory';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  // Logout function
  const handleLogout = () => {
    navigate('/login');
  };

  // Check if the current route is the Dashboard
  const isOnAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-container">
      <header className="app-header">
        <nav>
          {!isOnAuthPage && (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )}
          
          {/* Show Login and Signup links if user is not authenticated and NOT on Dashboard */}
          {isOnAuthPage && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<div>Welcome to the Banking App</div>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/fund-transfer" element={<FundTransfer />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
      </Routes>
    </div>
  );
};

export default App;
