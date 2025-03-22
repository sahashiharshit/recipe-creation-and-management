import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/verify.css";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";

const VerifyOtp = () => {
  const location = useLocation();
  const email= location.state?.email ||localStorage.getItem("email") || "";
  
  
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(60); // 60 seconds
    const navigate = useNavigate();
  
    // 🕰️ Start timer for OTP resend
    useEffect(() => {
      if (resendTimer > 0) {
        const interval = setInterval(() => {
          setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [resendTimer]);
  
    // ✅ Handle OTP Submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
       
        const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, { email,otp }, { withCredentials: true });
  
        if (res.status === 200) {
          showSuccessToast("🎉✅ OTP Verified Successfully!");
          localStorage.removeItem("email");
          navigate("/"); // Redirect to homepage or dashboard
        }
      } catch (error) {
        console.error("Error during OTP verification:", error.response?.data?.error);
        setError(error.response?.data?.error || "Invalid OTP. Please try again.");
        showErrorToast("❌ Invalid OTP! Please check and try again.");
      }
    };
  
    // 🔁 Resend OTP
    const resendOtp = async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/resend-otp`, {email}, { withCredentials: true });
        setResendTimer(60); // Reset timer after resending
        showSuccessToast("📩 OTP Resent Successfully!");
      } catch (error) {
        console.error("Error during OTP resend:", error.response?.data?.error);
        showErrorToast("❌ Failed to resend OTP. Please try again.");
      }
    };
  
    return (
      <div className="verify-container">
        <div className="verify-card">
          <h2 className="verify-title">Verify OTP</h2>
          <p>Email: {email}</p>
          {error && <p className="auth-error">{error}</p>}
  
          <form onSubmit={handleSubmit} className="verify-form">
            <div className="otp-group">
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
                placeholder="Enter your 6-digit OTP"
                className="otp-input"
              />
            </div>
  
            <button type="submit" className="verify-btn">
              Verify OTP
            </button>
          </form>
  
          {/* 🔁 Resend OTP Button */}
          {/* <p className="resend-text">
            {resendTimer > 0 ? (
              `Resend OTP in ${resendTimer}s`
            ) : (
              <button onClick={resendOtp} className="resend-btn">
                Resend OTP
              </button>
            )}
          </p> */}
  
          <p className="auth-footer">
            Didn&apos;t receive OTP?{" "}
            <button onClick={resendOtp} disabled={resendTimer > 0} className="auth-link">
              Resend
            </button>
          </p>
        </div>
      </div>
    );
  };
  
  export default VerifyOtp;