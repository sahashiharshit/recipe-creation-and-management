import axios from "axios";
import { createContext, useCallback,  useEffect, useState } from "react";
import PropTypes from 'prop-types';
// ✅ Create Context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// ✅ Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
// ✅ Fetch user profile
  const fetchUser = useCallback(async ()=>{
    try {
      const res = await axios.get("http://localhost:3000/api/users/profile", {
        withCredentials: true,
       
      });
      
      setUser(res.data);
    } catch (error) {
      if (error.response?.status === 401||error.response?.status===403) {
        setUser(null); // ✅ Auto-logout on forbidden access
      }
     
    } finally {
      setLoading(false);
    }
  
  },[]);
  // ✅ Run once when component mounts
  useEffect(() => {
    
    fetchUser();
   
  }, [fetchUser]);
   // ✅ Login function with error handling
  const login = useCallback(async (email, password) => {
    
    try {
       await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      await fetchUser();
      
     
      return { success: true }; // 🔹 Return success
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
    
  },[fetchUser]);

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
   
    return { success: false, error: "Logout failed "+error };
  }
  
  },[]);

  return (
    <AuthContext.Provider value={{ user,setUser,login, logout,loading }}>
      {children}
    </AuthContext.Provider>
  );
};
// ✅ Add PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

