/* eslint-disable no-unused-vars */
// ResetPassword.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Get email and verified status from location.state
 const email=localStorage.getItem("resetEmail");
 const isVerified =localStorage.getItem("isVerified");

  useEffect(() => {
    // 🚨 Redirect to forgot-password if no email or not verified
    if (!email || !isVerified) {
      showErrorToast("⚠️ Invalid request. Please restart the process.");
      navigate("/forgot-password");
    }
  }, [email, isVerified, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      showErrorToast("❗ New password is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          email,
          newPassword,
        }
      );

      if (res.status===200) {
        showSuccessToast("✅ Password reset successfully!");
        navigate("/login"); // Redirect to login after reset
      } else {
        showErrorToast(res.data.message || "❌ Error resetting password.");
      }
    } catch (error) {
      showErrorToast("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleResetPassword} className="auth-card">
        <h1 className="auth-title">Reset Password</h1>

        {/* Email Display */}
        <p className="email-info">✅ Email: {email}</p>

        <div className="input-group">
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

       
      </form>
    </div>
  );
};

export default ResetPassword;
