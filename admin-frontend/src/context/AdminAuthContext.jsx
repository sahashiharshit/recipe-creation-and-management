/* eslint-disable no-unused-vars */

import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { showErrorToast } from "../utils/toastUtils";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmin = useCallback(async (attempt = 1) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/profile`, {
        withCredentials: true,
        validateStatus:(status)=>status===200 || status===403,
      });
      
      if (res.status==200) {
        setAdmin(res.data);
      } else {
       setAdmin(null);
      }
    } catch {
      
      if (attempt < 3) {
        
        setTimeout(() => fetchAdmin(attempt + 1), 1000); // Retry after 1 sec
      } else {
        setAdmin(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  const adminLogin = useCallback(
    async (username, password) => {
      try {
        await axios.post(
          `${API_BASE_URL}/admin/login`,
          { username, password },
          { withCredentials: true }
        );
        await fetchAdmin(); // Refresh admin state
        return { success: true };
      } catch (error) {
        showErrorToast("Login Failed");
        return {
          success: false,
          error: error.response?.data?.message || "Login failed",
        };
      }
    },
    [fetchAdmin]
  );

  const adminLogout = useCallback(async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/admin/logout`,
        {},
        { withCredentials: true }
      );
      setAdmin(null);
      
    } catch (error) {
      showErrorToast("Logout failed!");
      return { success: false, error: "Logout failed " + error };
    }
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ admin, setAdmin, adminLogin, adminLogout, loading }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
