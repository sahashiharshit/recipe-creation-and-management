/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import LoadingBar from "../components/LoadingBar";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(loading) return;
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate,loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   
      const response = await login(email, password);
      
      if (response.success) {
        navigate("/", { replace: true }); // ✅ Redirect to homepage after successful login
        showSuccessToast("🔓✅ Logged in successfully!");
      } else {
      
        if (response.error_code === 401) {
          try {
            await axios.post(`${API_BASE_URL}/api/auth/resend-otp`,{email},{withCredentials:true});
          } catch (error) {
            showErrorToast(error);
          }
          localStorage.setItem("email",email);
          navigate("/verify-otp",{state:{email:email}});
          showErrorToast("🚫 User not verified. Please verify your account.");
          
        } else if (response.error_code === 403) {
          showErrorToast("❌ Access forbidden. Verification required.");
        } else if (response.error_code === 404) {
          showErrorToast("📞❌ User not found. Please register first.");
        } else {
          showErrorToast( response.error ||"❌ Invalid username or password!");
        }
      }
    } catch (error) {
      if (error.message === "Network Error") {
        showErrorToast("🌐 Network Error. Please check your connection.");
      } else {
        showErrorToast("🚨 Something went wrong. Please try again.");
      }
    }
  };
  // ✅ Show LoadingBar while checking authentication
  if(loading){
    return <LoadingBar />
    }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h1 className="auth-title">Login</h1>

        <div className="input-group">
          <div className="input-container">
            <FaEnvelope className="icon" /> {/* 👈 Added Icon */}
            <input
              type="email"
              placeholder="Enter your Email"
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

        <button type="submit" className="auth-btn">
          Login
        </button>
        
         {/* 🛑 Forgot Password Link */}
         <p className="forgot-password">
          <a href="/forgot-password" className="auth-link">
            Forgot Password?
          </a>
        </p>
        
        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="auth-link">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
