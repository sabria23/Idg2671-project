import styles from "../../styles/Dash.module.css";
import React from 'react';

const DashboardPage = () => {
  return (
   <div className={styles.container}>
        {/*this is the header/navbar*/}
        <header className={styles.header}>
            <div className={styles.logo}>
                <span className={styles.logoText}>StudyPlatform</span>
            </div>

            <div className={styles.navActions}>
                <button className={styles.navButton}>
                    <span className={styles.iconWrapper}>
                        <i className={styles.icon}>i</i>
                    </span>
                    Create a new Study
                </button>
            </div>

            <button className={styles.navButton}>
                <span className={styles.iconWrapper}>
                     <i className={styles.icon}>i</i>
                </span>
                Profile
            </button>

            <button className={styles.navButton}>
                <span className={styles.iconWrapper}>
                     <i className={styles.icon}>i</i>
                </span>
                Logout
            </button>
        </header>

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