/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */


import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { showErrorToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";

// ✅ Create Context
 
const AuthContext = createContext();

// ✅ Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (attempt = 1) => {
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        withCredentials: true, // Ensure cookies are sent
        
        validateStatus:(status)=>status===200 || status===401,
      });
    if(response.status===200){
      setUser(response.data);
      }
    else{
      setUser(null);
    }
      
    } catch {
     
       if (attempt < 3) {
     
        setTimeout(() => fetchUser(attempt + 1), 1000); // Retry after 1 sec
      } else{
        setUser(null);
   
      }
    } finally{
    setLoading(false);
    }
    
  
  },[]);
  useEffect(() => {
    
    fetchUser();
    
  }, [fetchUser,]);
  
   
  // ✅ Login function with error handling
  const login = useCallback(
    async (email, password) => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );
        await fetchUser();

        return { success: true }; // 🔹 Return success
      } catch (error) {
       console.error(error);
        return {
        
          success: false,
          error: error.response?.data?.message || "Login failed",
          error_code:error.response?.status||500,
        };
      }
    },
    [fetchUser]
  );

  // ✅ Logout function with error handling
  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      return { success: true }; // 🔹 Return success
    } catch (error) {
      showErrorToast("Logout failed!");
      return { success: false, error: "Logout failed " + error };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser,login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
// ✅ Add PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
 
export const useAuth = () => { 

const context = useContext(AuthContext);

if(!context){
  throw new Error("useAuth must be used within an AuthProvider");
}
return context;
};