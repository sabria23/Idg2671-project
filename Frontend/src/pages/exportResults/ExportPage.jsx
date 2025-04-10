import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import styles from '../../styles/Export.module.css';

const ExportPage = () => {
  const { studyId } = useParams();
  
  const handleLogout = () => {
    console.log("Logging out...");
  };

  const exportNavItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "Logout", action: handleLogout }
  ];

  return (
    <div className={styles.exportContainer}>
      <Navbar
        title="StudyPlatform"
        navItems={exportNavItems}
        onLogout={handleLogout}
      />
      
      <div className={styles.breadcrumb}>
        <Link to="/dashboard">Dashboard</Link> &gt; Export Results
      </div>
      
      <main className={styles.mainContent}>
        <h1>Export Study Results</h1>
       
        <div className={styles.summaryCards}>
          <div className={styles.card}>
            <h3>Status</h3>
            <div className={styles.cardValue}>
              Draft
            </div>
            <div className={styles.cardDescription}>
              Study status
            </div>
          </div>
          
          <div className={styles.card}>
            <h3>Participants</h3>
            <div className={styles.cardValue}>
              0
            </div>
            <div className={styles.cardDescription}>
              Total participants
            </div>
          </div>
          
          <div className={styles.card}>
            <h3>Responses</h3>
            <div className={styles.cardValue}>
              0
            </div>
            <div className={styles.cardDescription}>
              Responses shown
            </div>
          </div>
        </div>
        
        <div className={styles.exportControls}>
          <button className={styles.exportButton}>
            Export as JSON
          </button>
        </div>
        
        <div className={styles.dataPreview}>
          <h2>Response Data</h2>
          <p>No responses found for this study.</p>
        </div>
      </main>
    </div>
  );
};

export default ExportPage;