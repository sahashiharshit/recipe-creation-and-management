import { useContext } from "react";
import {AuthContext} from "./AuthContext";

// ✅ Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);