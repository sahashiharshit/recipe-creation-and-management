import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../assets/styles/Auth.css"
import {FaEnvelope,FaLock} from 'react-icons/fa';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]= useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await login(email, password);
      if (response.success) {
        navigate("/"); // ✅ Redirect to homepage after successful login
      } else {
        setError(response.error); // ✅ Show error message on failed login
      }
    } catch (error) {
      setError("Something went wrong. Please try again.",error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h1 className="auth-title">Login</h1>
        {error && <p className="auth-error">{error}</p>} {/* ✅ Display error */}

        <div className="input-group">
       
          <div className="input-container">
          <FaEnvelope className="icon" /> {/* 👈 Added Icon */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
      
          <div className="input-container">
          <FaLock className="icon" /> {/* 👈 Added Icon */}
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="auth-btn">Login</button>
        <p className="auth-footer">
          Don&apos;t have an account? <a href="/signup" className="auth-link">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
