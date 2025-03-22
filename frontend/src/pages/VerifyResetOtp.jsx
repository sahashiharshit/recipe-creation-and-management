/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState("");
 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // ✅ Get email from state passed by ForgotPassword page
  const email = localStorage.getItem("resetEmail");

    // Redirect to forgot-password if no email is passed
    
  

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email) {
        showErrorToast("⚠️ No email found! Please restart the process.");
        navigate("/forgot-password");
        return;
      }
    if (!otp.trim()) {
      showErrorToast("❗ OTP is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-reset-otp`,
        { email, otp }
      );

      if (res.status===200) {
        showSuccessToast("✅ OTP Verified! Redirecting to reset password...");
        localStorage.setItem("isVerified",true);
        // Navigate to reset-password page with email and verified status
        navigate("/reset-password");
      } else {
        showErrorToast(res.data.message || "❌ Invalid OTP. Please try again.");
      }
    } catch (error) {
      showErrorToast("❌ Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleVerifyOtp} className="auth-card">
        <h1 className="auth-title">Verify OTP</h1>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

   
      </form>
    </div>
  );
};

export default VerifyResetOtp;
