import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // Import icons
import "../assets/styles/Auth.css";
import { showErrorToast, showSuccessToast } from "../utils/ToastUtils";
const Signup =()=>{

const [formData,setFormData] = useState({

username:"",
email:"",
password:"",
});

const [error, setError] = useState("");
const navigate = useNavigate();

const handleChange =(e)=>{

setFormData({...formData,[e.target.name]:e.target.value});
}
const handleSubmit = async(e)=>{

e.preventDefault();
setError('');
try {
    const res = await axios.post(`http://localhost:3000/api/auth/register`,formData,{
    withCredentials:true,
    });
    if(res.status===201){
    navigate('/login');
    showSuccessToast("🎉✅ Registration completed successfully!")
    }
} catch (error) {
    setError(error.response?.data?.error || "Something went wrong");
    showErrorToast("🚨❌ Action failed. Please try again!");
}
};
return (
    <div className="signup-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
           
            <div className="input-container">
              <FaUser className="icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="input-group">
           
            <div className="input-container">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="input-group">
            
            <div className="input-container">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login" className="auth-link">Login</a>
        </p>
      </div>
    </div>
  );
};
export default Signup;