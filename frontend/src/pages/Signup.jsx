import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // Import icons
import "../styles/Auth.css";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";
import { useAuth } from "../context/AuthContext";
import LoadingBar from "../components/LoadingBar";

const Signup = () => {
const {user,loading} = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [availability, setAvailability] = useState({
    username: null,
    email: null,
  });
  const [usernameValid,setUsernameValid]= useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  useEffect(()=>{
   
    if(user){
      navigate("/",{replace:true});
    }
    
    },[user,navigate]);
  // Regex to allow only letters, numbers, and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  
  // Function to check username availability
  const checkUsername = async (username) => {
    if (username.length < 5) {
      setAvailability((prev) => ({ ...prev, username: null }));
      return;
    }
    if(!usernameRegex.test(username)){
    setUsernameValid(false);
    setAvailability((prev)=>({...prev,username:null}));
    return;
    }
    setUsernameValid(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/check-availbility`,
        { username: username },
        {
          withCredentials: true,
        }
      );
      
      setAvailability((prev) => ({
        ...prev,
        username: res.data.usernameAvailable,
      }));
    } catch (error) {
      console.log("Error", error);
    }
  };
  // Function to check email availability
  const checkemail = async (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setAvailability((prev) => ({ ...prev, email: null }));
      return;
    }
   
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/check-availbility`,
        { email },
        {
          withCredentials: true,
        }
      );
      setAvailability((prev) => ({ ...prev, email: res.data.emailAvailable, }));
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "username") {
      checkUsername(value);
    }
    if (name === "email") {
      checkemail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!usernameValid) {
      showErrorToast("🚨❌ Username can only contain letters, numbers, and underscores!");
      return;
    }
    if(availability.username===false){
      showErrorToast("🚨❌ Username is already taken!");
      return;
    
    }
    if (availability.email === false) {
      showErrorToast("🚨❌ Email is already registered!");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        {...formData},
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
     
        showSuccessToast("🎉✅ Registration completed successfully!");
        
        localStorage.setItem("email", formData.email);
        navigate("/verify-otp",{
        state:{email:formData.email},
        });
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
      showErrorToast("🚨❌ Action failed. Please try again!");
    }
  };
  
  if(loading){
  return <LoadingBar/>
  }
  
  return (
    <div className="auth-container">
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
            {!usernameValid && <span className="invalid">❌ Only letters, numbers, and underscores allowed!</span>}
            {usernameValid && availability.username !== null && (
              <span className={availability.username ? "valid" : "invalid"}>
                {availability.username ? "✅ Available" : "❌ Taken"}
              </span>
            )}
          </div>
          

          <div className="input-group">
            <div className="input-container phone-group" >
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
            {availability.email !== null && (
              <span className={availability.email ? "valid" : "invalid"}>
                {availability.email ? "✅ Available" : "❌ Taken"}
              </span>
            )}
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

          <button type="submit" className="auth-btn">
            Sign Up
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login" className="auth-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
export default Signup;
