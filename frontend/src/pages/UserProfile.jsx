/* eslint-disable no-unused-vars */
import { useAuth } from "../context/useAuth";
import {  useState } from "react";
import {  } from "react-router-dom";
import axios from 'axios';
import defaultAvatar from '../assets/images/default-avatar.png';
import '../assets/styles/Profile.css';
import { showErrorToast, showSuccessToast } from "../utils/ToastUtils";


const UserProfile =()=>{
const {user,setUser} = useAuth();
const [uploading,setUploading] = useState(false);
const [preview, setPreview] = useState(null);


const handleImageChange=async(event)=>{
const file = event.target.files[0];
if(!file) return;
const previewURL = URL.createObjectURL(file);
setPreview(previewURL);
const formData = new FormData();
formData.append("profileImage", file);
try {
    setUploading(true);
    const response = await axios.post("http://localhost:3000/api/users/upload-profile-pic", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    setUser((prevUser) => ({
      ...prevUser,
      profileImage: response.data.profileImage, // Update profile image dynamically
    }));
    setPreview(null);
    showSuccessToast("🎉 Profile picture submitted successfully!");
  } catch (error) {
    showErrorToast("❌ Profile picture not updated. Try again!");
    setPreview(null); 
  } finally {
    setUploading(false);
  }

}
return ( <div className="profile-container">
    <h2 className="profile-title">Profile</h2>
    <div className="profile-content">
      <img 
        src={preview || user?.profilePicture || defaultAvatar} 
        alt="Profile" 
        className="profile-image" 
      />
      <h3 className="profile-name">{user?.username}</h3>
      <p className="profile-email">{user?.email}</p>
      <label className="upload-btn">
          {uploading ? "Uploading..." : "Change Profile Picture"}
          <input 
            type="file"
            name="profileImage"
            accept="image/*" 
            onChange={handleImageChange} 
            disabled={uploading} 
          />
        </label>
    </div>
  </div>);


}

export default UserProfile;