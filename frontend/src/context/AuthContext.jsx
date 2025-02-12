import axios from "axios";
import { createContext, useCallback,  useEffect, useState } from "react";
import PropTypes from 'prop-types';
// ✅ Create Context
const AuthContext = createContext();

// ✅ Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController(); // 🔹 Fix memory leak issue
    setTimeout( async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/profile", {
          withCredentials: true,
          signal: controller.signal,
        });
        
        setUser(res.data);
      } catch (error) {
        if (error.response?.status === 403) {
          setUser(null); // ✅ Auto-logout on forbidden access
        }
       
      }
    },500);
    return () => controller.abort();  // 🔹 Cleanup function
  }, []);

   // ✅ Login function with error handling
  const login = useCallback(async (email, password) => {
    
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data);
      return { success: true }; // 🔹 Return success
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
    
  },[]);

  // ✅ Logout function with error handling
  const logout = useCallback(async()=>{
  
  try {
    await axios.post(
      "http://localhost:3000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    return { success: true }; // 🔹 Return success
  } catch (error) {
   
    return { success: false, error: "Logout failed" };
  }
  
  },[]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// ✅ Add PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export {AuthContext};
