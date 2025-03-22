/* eslint-disable no-unused-vars */
import { useState } from "react";
import "../styles/UserProfileModal.css";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { FaCross } from "react-icons/fa";

const UserProfileModal = ({ user, onClose,admin }) => {
    const [updatedRole, setUpdatedRole] = useState(user.role);
    const [loading, setLoading] = useState(false);
    console.log(admin.role)
  if (!user) return null;
  const handleRoleUpdate = async () => {
    if (user.role === updatedRole) {
      showErrorToast("No changes made to the role.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/admin/update-role/${user.id}`,
        { role: updatedRole },
        { withCredentials: true }
      );

      if (response.status === 200) {
        showSuccessToast("User role updated successfully!");
        onClose(); // Close modal after success
      }
    } catch (error) {
      showErrorToast("Error updating user role.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>User Profile</h3>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Current Role:</strong> {user.role}
        </p>

        {/* Role Update Section */}
        {admin.role === "superadmin" && user.role !== "superadmin" && (
          <div className="role-update-section">
            <label htmlFor="role">Change Role:</label>
            <select
              id="role"
              value={updatedRole}
              onChange={(e) => setUpdatedRole(e.target.value)}
              disabled={loading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">SuperAdmin</option>
            </select>
            <button
              onClick={handleRoleUpdate}
              disabled={loading}
              className="update-btn"
            >
              {loading ? "Updating..." : "Update Role"}
            </button>
          </div>
        )}

        <button onClick={onClose} className="close-btn">
        X
        </button>
      </div>
    </div>
  );
};

export default UserProfileModal;
