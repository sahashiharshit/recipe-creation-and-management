/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";



const AdminAuthContext = createContext();


export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchAdmin = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/admin/profile", {
                withCredentials: true,
            });
            setAdmin(res.data);
        } catch (error) {
            setAdmin(null);
        } 
    };
    useEffect(() => {
        
        fetchAdmin().finally(()=>setLoading(false));
    }, []);

    const adminLogin = async (username, password) => {
        try {
            await axios.post("http://localhost:3000/api/admin/login", { username, password }, { withCredentials: true });
            await fetchAdmin();  // Refresh admin state
            return { success: true };
        } catch (error) {
            return { success: false, error: "Login failed" };
        }
    };

    const adminLogout = async () => {
        try {
            await axios.post("http://localhost:3000/api/admin/logout", {}, { withCredentials: true });
            setAdmin(null);
        } catch (error) {
            console.error("Logout failed");
        }
    };

    return (
        <AdminAuthContext.Provider value={{ admin, adminLogin, adminLogout, loading }}>
            {children}
        </AdminAuthContext.Provider>
    );
};
AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useAdminAuth = () => useContext(AdminAuthContext);