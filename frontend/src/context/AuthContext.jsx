import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { showErrorToast } from "../utils/toastUtils";
// ✅ Create Context
 
const AuthContext = createContext();

// ✅ Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user profile
  const fetchUser = useCallback(async (controller) => {
    try {
      const res = await axios.get("http://localhost:3000/api/users/profile", {
        withCredentials: true,
        signal: controller?.signal,
      });

      setUser(res.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null); // ✅ Auto-logout on forbidden access
        showErrorToast("Something went wrong! Login again...");
      }
    } finally {
      setLoading(false);
    }
  }, []);
  // ✅ Run once when component mounts
  useEffect(() => {
    const controller = new AbortController();
    fetchUser(controller);
    return () => controller.abort();
  }, [fetchUser]);
  // ✅ Login function with error handling
  const login = useCallback(
    async (email, password) => {
      try {
        await axios.post(
          "http://localhost:3000/api/auth/login",
          { email, password },
          { withCredentials: true }
        );
        await fetchUser();

        return { success: true }; // 🔹 Return success
      } catch (error) {
        showErrorToast("Login Failed");
        return {
        
          success: false,
          error: error.response?.data?.message || "Login failed",
        };
      }
    },
    [fetchUser]
  );

  // ✅ Logout function with error handling
  const logout = useCallback(async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
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
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
// ✅ Add PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => { 

const context = useContext(AuthContext);

if(!context){
  throw new Error("useAuth must be used within an AuthProvider");
}
return context;
};