import React from 'react'
import {useState} from "react";
import styles from "../../styles/PorfilePage.module.css";

const ProfilePage = () => {
  const [editProfile, setEditProfile] = useState(false);
      /*You're running into a common JavaScript hoisting issue. The problem is that you're using the handleLogout function in your dashboardNavItems array before you've actually defined the function.
    In JavaScript, function declarations are hoisted (moved to the top), but function expressions (like the arrow function you're using) are not. To fix this, you need to define your handleLogout function before you use it:*/
  
  return (
    <>

      <div className={styles.headerSection}>
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
      </div>
      
      <div className={styles.infoContainer}>
        <div className={styles.profileImg}>J</div>
        <div className={styles.infoWrapper}>
          {editProfile ? (
            <>
              <div className={styles.formGroup}>
                <label>Username</label>
                <input type="text" defaultValue="JohnDoe" />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" defaultValue="john@example.com" />
              </div>
              <button className={styles.saveBtn}>Save</button>
            </>
          ) : (
            <>
              <p><strong>Username:</strong> JohnDoe</p>
              <p><strong>Email:</strong> john@example.com</p>
            </>
          )}
        </div>
      </div>
      
      <h2 className={styles.sectionHeader}>Account Settings</h2>
      
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
      </div>
    </>
  )
}

export default ProfilePage