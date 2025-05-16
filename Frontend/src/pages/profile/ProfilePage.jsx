import React from 'react'
import {useEffect, useState} from "react";
import styles from "../../styles/PorfilePage.module.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [username, setUsername] = useState("");
    const [editedUsername, setEditedUsername] = useState("");
    // const [avatar, setAvatar] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.delete("https://group4-api.sustainability.it.ntnu.no/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          alert("Your account has been successfully deleted.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting account", error);
        
      }
    }


    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("https://group4-api.sustainability.it.ntnu.no/api/auth/user", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

          const user = response.data.data;
          console.log("data from backend", user);
          setUsername(user.username || "");
          setEditedUsername(user.username || "");
          // setAvatar(avatar || "default-avatar.png");
        } catch (err) {
          console.error("Failed to load profile", err);
        }
      };
  
      fetchUserProfile();
    }, []);

      const handleSave = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem("token");
          const response = await axios.put("https://group4-api.sustainability.it.ntnu.no/api/auth/update-profile",
            { username: editedUsername },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            alert("profile updated successfully!");
            setUsername(editedUsername);
            setEditProfile(false);
          }
        } catch (error) {
          console.error("Failed to update profile", error);
          alert("Error updating profile.")
        } 
      }

      const isSaveDisabled = !editProfile || editedUsername === username;
    
  return (
    <>
    <div className={styles.infoContainer}>
      
    <div className={styles.headerSection}>
      <h1> profile</h1>
      <div>
        {!editProfile ? (
          <button className={styles.editBtn} onClick={() => setEditProfile(true)}>
          Edit Profile
        </button>
        ) : (
          <button className={styles.cancelBtn} onClick={() => setEditProfile(false)}>
            CancelYour
          </button>
        )}
      </div>
    </div>
      <div className={styles.profileDetails}>
        <div className={styles.profileImg}>
          {username}
        </div>
        <p className={styles.usernameProfile}> { username }</p>
      </div>
    

      <div className={styles.fieldContainer}>
        <form action="" onSubmit={handleSave}>
          <label htmlFor="username"> Username
          <input 
            type="text"
            id='username'
            value={ editedUsername }
            placeholder='username'
            onChange={(e) => setEditedUsername(e.target.value)}
            disabled={!editProfile}
          />
        </label>

        <button 
          className={styles.saveBtn}
          type='submit'
          disabled={isSaveDisabled}
          >
            Save
        </button>
        </form>
      </div>
    </div>

    <div className={styles.dangerContainer}>
        <div className={styles.settingInfo}>
          <h3>Delete Account</h3>
          <p>Please be certain you want to delete your account, this action cannot be reversed</p>
        </div>
        <button 
          className={styles.deleteBtn}
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete Account
        </button>
        
        {/* are u sure? */}
        <div className={styles.confirmDeleteContainer}>
          {showDeleteConfirm && (
      <div className={styles.confirmationModal}>
        <div className={styles.modalContent}>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <button className={styles.confirmDeleteBtn}
          onClick={handleDeleteAccount}
        >
          Yes, Delete My Account
        </button>

        {/* cancel dele */}
        <button className={styles.confirmCancelBtn}
          onClick={() => setShowDeleteConfirm(false)}>
          Cancel
        </button>
        </div>
      </div>
    )}
        </div>
        
      </div> 

      

   
  
    
      {/* <div className={styles.headerSection}>
        <h1>Your Profile</h1>
        <div>
          {!editProfile ? (
            <button className={styles.editBtn} onClick={() => setEditProfile(true)}>
              Edit Profile
            </button>
          ) : (
            <button className={styles.cancelBtn} onClick={() => setEditProfile(false)}>
              Cancel
            </button>
          )}
        </div>
      </div> */}
      
      {/* <div className={styles.infoContainer}>
        <div className={styles.profileImg}>J</div>
        <div className={styles.infoWrapper}>
          {editProfile ? (
            <>
              <div className={styles.formGroup}>
                <label>Username</label>
                <input 
                  type="text" 
                  value={username}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input 
                  type="email"
                  value={email} 
                 
                />
              </div>
              <button className={styles.saveBtn}>Save</button>
            </>
          ) : (
            <>
            <form action="">
              <input defaultValue={data.username} onChange={handleChange} />
            </form>
              <p><strong>Username:</strong>{username}</p>
              <p><strong>Email:</strong>{email}</p>
            </>
          )}
        </div>
      </div> */}
      
      {/* 
      
      <div className={styles.settingContainer}>
        <div className={styles.settingInfo}>
          <h3>Password</h3>
          <p>Change your account password</p>
        </div>
        <button className={styles.actionBtn}>Change Password</button>
      </div>
      
      <h2 className={styles.dangerHeader}>Danger Zone</h2>
      
      <div className={styles.dangerContainer}>
        <div className={styles.settingInfo}>
          <h3>Delete Account</h3>
          <p>Please be certain you want to delete your account, this action cannot be reversed</p>
        </div>
        <button className={styles.deleteBtn}>Delete Account</button>
      </div> */}
    </>
  )
}

export default ProfilePage