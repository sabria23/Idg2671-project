import styles from "../../styles/Dash.module.css";
import React from 'react';
import Navbar from "../../components/common/Navbar";

const DashboardPage = () => {
    const handleLogout = () => {
        console.log("Logging out...");
        // Add your logout logic here
      };
       // Your specific navigation items for the Dashboard
    const dashboardNavItems = [
        { label: "Create a study", path: "/create-study" },
        { label: "Profile", path: "/profile" },
        { label: "Logout", action: handleLogout }
    ];

  return (
   <div className={styles.container}>
        {/*this is the header/navbar with props*/}
        <Navbar 
            title="StudyPlatform" 
            navItems={dashboardNavItems}
            onLogout={handleLogout} 
        />
        {/*main content*/}
        <main className={styles.mainContent}>
            <h1 className={styles.welcomeHeader}>hello, you</h1> {/*this will take varibale to username and time */}
            {/* Empty state for projects */}
            <div className={styles.emptyStateContainer}>
                <div className={styles.emptyState}>
                    <h3>Organize all your studies with projects</h3>
                    <button className={styles.createFirstButton}>Create your first project</button>
                </div>
            </div>

            {/* Study item */}
            <div className={styles.studyItem}>
                <div className={styles.studyType}>
                    <span className={styles.testIcon}>Test</span>
                </div>
            
                <div className={styles.studyInfo}>
                    <div className={styles.studyName}>Copy of Compare competitor pricing pages</div>
                </div>
            
                <div className={styles.responseInfo}>
                    <div className={styles.responseCount}>0 Responses</div>
                    <div className={styles.responseStatus}>Waiting for recruitment</div>
                </div>
            
                <div className={styles.studyActions}>
                    <button className={styles.recruitButton}>Recruit</button>
                    <div className={styles.studyDate}>6 Mar 2025</div>
                    <div className={styles.userIndicator}>M</div>
                    <button className={styles.menuButton}>⋮</button>
                </div>
            </div>

                            {/* Dropdown menu (shown for demonstration) */}
                <div className={styles.dropdownContainer}>
                    <div className={styles.dropdownMenu}>
                        <button className={styles.dropdownItem}>Rename</button>
                        <button className={styles.dropdownItem}>Edit</button>
                        <button className={styles.dropdownItem}>Duplicate</button>
                        <button className={styles.dropdownItem}>Archive</button>
                        <button className={`${styles.dropdownItem} ${styles.dangerItem}`}>Delete</button>
                    </div>
             </div>
        </main>

   </div>
  )
}

export default DashboardPage