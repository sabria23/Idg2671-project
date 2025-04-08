import React, { useState } from 'react';
import styles from '../../styles/Recruitment.module.css';
import Navbar from "../../components/common/Navbar";
import RecruitLink from './components/RecruitLink';



const RecruitmentPage = () => {

    const handleLogout = () => {
        console.log("Logging out...");
        // Add your logout logic here
    };

    // Navigation items for the Recruitment page
    const recruitmentNavItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Profile", path: "/profile" },
        { label: "Logout", action: handleLogout }
    ];

    return (
        <div className={styles.recruitmentContainer}>
            <Navbar 
                title="StudyPlatform" 
                navItems={recruitmentNavItems}
                onLogout={handleLogout}
            />

            <main className={styles.mainContent}>
                <h1>Recruit Participants</h1>
                
                <div className={styles.tabNavigation}>
                    <button>
                        Add emails
                    </button>
                    <RecruitLink />
                    
                </div>
            </main>
        </div>
    );
};

export default RecruitmentPage;