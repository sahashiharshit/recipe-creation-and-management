 
// ForgotPassword.jsx
import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import "../styles/Auth.css";
import { FaEnvelope } from "react-icons/fa";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
        showErrorToast("📧 Please enter your email address.");
        return;
      }
  
    try {
        setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      console.log(res.data);
      if (res.status===200) {
        showSuccessToast("📨 OTP sent successfully! Check your email.");
        localStorage.setItem("resetEmail", email);
        // ✅ Navigate to verify-reset-otp page with email in state
        navigate("/verify-reset-otp");
      } else {
        showErrorToast(res.data.message || "⚠️ Error sending OTP.");
      }
    } catch (error) {
        showErrorToast(
            error.response?.data?.message || "❌ Failed to send OTP. Try again."
          );
    }finally {
        setLoading(false);
      }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleForgotPassword} className="auth-card">
        <h1 className="auth-title">Forgot Password</h1>
        <div className="input-group">
          <div className="input-container">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
        <p className="auth-footer">
          Remembered your password?{" "}
          <a href="/login" className="auth-link">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
