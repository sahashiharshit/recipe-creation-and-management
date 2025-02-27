/* eslint-disable no-unused-vars */

/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { showErrorToast } from "../utils/toastUtils";
import { useLocation } from "react-router-dom";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const fetchAdmin = useCallback(
    async (controller) => {
      if (!isAdminRoute) return;
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/admin/profile", {
          withCredentials: true,
          signal: controller?.signal,
        });

        setAdmin(res.data);
        localStorage.setItem("admin", JSON.stringify(res.data));
      } catch (error) {
        if (axios.isCancel(error)) {
          
          return; // Exit if request was intentionally aborted
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
           
            await axios.post(
              "http://localhost:3000/api/admin/refresh",
              {},
              { withCredentials: true }
            );
            // 🔄 Retry fetching admin profile after refresh
            const res = await axios.get(
              "http://localhost:3000/api/admin/profile",
              {
                withCredentials: true,
                signal: controller?.signal,
              }
            );
            setAdmin(res.data);
            localStorage.setItem("admin", JSON.stringify(res.data));
          } catch (refreshError) {
            setAdmin(null);
            localStorage.removeItem("admin");
            showErrorToast("Session expired! Please log in again.");
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [isAdminRoute]
  );
  useEffect(() => {
    const controller = new AbortController();
    fetchAdmin(controller);
    return () => {
      controller.abort();
    };
  }, [fetchAdmin]);

  const adminLogin = useCallback(
    async (username, password) => {
      try {
        await axios.post(
          "http://localhost:3000/api/admin/login",
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
        "http://localhost:3000/api/admin/logout",
        {},
        { withCredentials: true }
      );
      setAdmin(null);
      localStorage.removeItem("admin");
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
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
