import React from 'react'
import Navbar from '../../components/common/Navbar';
import {useState} from "react";
import styles from "../../styles/PorfilePage.module.css";

const ProfilePage = () => {
    const [editProfile, setEditProfile] = useState(false);
    /*You're running into a common JavaScript hoisting issue. The problem is that you're using the handleLogout function in your dashboardNavItems array before you've actually defined the function.
    In JavaScript, function declarations are hoisted (moved to the top), but function expressions (like the arrow function you're using) are not. To fix this, you need to define your handleLogout function before you use it:*/
    const handleLogout = () => {
        console.log("logging out...");
    }
    const dashboardNavItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Logout", action: handleLogout }
    ];

  return (
    <>
        <Navbar 
        title="StudyPlatform"
        navItems={dashboardNavItems}
        onLogout={handleLogout}/>
    
        <div className={styles.headerSection}>
            <h1>Your Profile</h1>
            <div>
                {!editProfile ? (
                    <button onClick={() => setEditProfile(true)}>
                        Edit Profile
                    </button>
                ) : (
                    <button onClick={() => setEditProfile(false)}>
                        Cancel
                    </button>
                )}
            </div>
        </div>

        <div className={styles.infoContainer}>
            <div className={styles.profileImg}>J</div>
            <div className={styles.infoWrapper}>
                <p>username</p>
                <p>email</p>
            </div>
        </div>
       
       <p>Account settings</p>


    </>
  )
}

export default ProfilePage