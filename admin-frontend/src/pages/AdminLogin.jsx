/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { useAdminAuth } from "../context/AdminAuthContext";
import LoadingBar from "../components/LoadingBar";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 
  const { adminLogin,admin,loading } = useAdminAuth();
  const navigate = useNavigate();
  useEffect(()=>{
  
  if(loading) return;
  if(admin){
    navigate("/dashboard",{replace:true});
  }
  },[admin,navigate,loading]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await adminLogin(username, password);

      if (response.success) {
        navigate("/dashboard",{replace:true}); // ✅ Redirect to homepage after successful login
        showSuccessToast("🔓✅ Logged in successfully!");
      } else {
        showErrorToast("🔑❌ Invalid credentials!");
      }
    } catch (error) {
      showErrorToast("Something went wrong. Please try again.");
    }
  };
  if(loading) <LoadingBar/>;
  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h1 className="auth-title">Admin Login</h1>

        <div className="input-group">
          <div className="input-container">
            <FaEnvelope className="icon" /> {/* 👈 Added Icon */}
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {/* <button type="button" onClick={() => setShowPassword(!showPassword)}>👁️</button> */}
          </div>
        </div>

        <button type="submit" className="auth-btn">
          Login
        </button>
        <p className="auth-footer">
          Don&apos;t have an account? <a href="/signup" className="auth-link">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
