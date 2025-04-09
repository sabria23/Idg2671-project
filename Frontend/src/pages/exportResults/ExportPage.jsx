/*import React from 'react';
import Navbar from "../../components/common/Navbar";

const ExportPage = () => {

    const handleLogout = () => {
      console.log("logging out..");
    };
  //navigation "items" for export page
  const exportNavItems = [
    { label: "Dashboard", path: "/dashboard"},
    { label: "Profile", path: "/profile"},
    { label: "Logout", path: handleLogout}
  ];
  return (
    <div>
      <Navbar
        title="StudyPlatform"
        navItems={exportNavItems}
        onLogout={handleLogout}
      />

      <main>
        <h1>Export Results</h1>
        <p>This page will allow you to export study results</p>
      </main>
    </div>
  )
}

export default ExportPage*/
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import styles from '../../styles/Export.module.css';

const ExportPage = () => {
  const { studyId } = useParams();
  const [study, setStudy] = useState(null);
  const [responses, setResponses] = useState([]);
  
  const handleLogout = () => {
    // Your logout logic
    console.log("Logging out...");
  };

  const exportNavItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "Logout", action: handleLogout }
  ];
  
  // Fetch studies and responses here...
  
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
        {/* Summary Cards */}
        <div className={styles.summaryCards}>
          <div className={styles.card}>
            <h3>Status</h3>
            <div className={styles.cardValue}>
              {selectedStudy?.published ? "Active" : "Draft"}
            </div>
            <div className={styles.cardDescription}>
              Study status
            </div>
          </div>
          
          <div className={styles.card}>
            <h3>Participants</h3>
            <div className={styles.cardValue}>
              {responses.length || 0}
            </div>
            <div className={styles.cardDescription}>
              Total participants
            </div>
          </div>
          
          <div className={styles.card}>
            <h3>Responses</h3>
            <div className={styles.cardValue}>
              {responses.length || 0}
            </div>
            <div className={styles.cardDescription}>
              Responses shown
            </div>
          </div>
        </div>
        
        {/* Export Controls */}
        <div className={styles.exportControls}>
          <select 
            className={styles.studySelector}
            onChange={(e) => setSelectedStudy(studies.find(s => s._id === e.target.value))}
          >
            <option value="">Select a study</option>
            {studies.map(study => (
              <option key={study._id} value={study._id}>{study.title}</option>
            ))}
          </select>
          
          <button className={styles.exportButton}>
            Export as CSV
          </button>
        </div>
        
        {/* Data Preview */}
        <div className={styles.dataPreview}>
          <h2>Response Data</h2>
          {loading ? (
            <p>Loading responses...</p>
          ) : responses.length > 0 ? (
            <table className={styles.responseTable}>
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Response</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response, index) => (
                  <tr key={response._id || index}>
                    <td>Participant {index + 1}</td>
                    <td>{new Date(response.createdAt).toLocaleDateString()}</td>
                    <td>{response.isCompleted ? "Complete" : "Incomplete"}</td>
                    <td>{response.responses.length} questions</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No responses found for this study.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExportPage;