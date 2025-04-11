import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import styles from '../../styles/Export.module.css';
import studyService from "../../services/studyService";
import DownloadJSON from './components/DownloadJson';

const ExportPage = () => {
  const { studyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const result = await studyService.getResponses(studyId);
        setResponses(result.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError('Failed to load responses. Please try again.');
        setLoading(false);
      }
    };

    if (studyId) {
      fetchResponses();
    }
  }, [studyId]);
  
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
              {responses.length || 0}
            </div>
            <div className={styles.cardDescription}>
              Total participants
            </div>
          </div>
          
          <div className={styles.card}>
            <h3>Responses</h3>
            <div className={styles.cardValue}>
              {responses.length || 0}
            </div>
            <div className={styles.cardDescription}>
              Responses shown
            </div>
          </div>
        </div>
        
        <div className={styles.exportControls}>
          {responses.length > 0 ? (
            <div className={styles.exportButton}>
              <DownloadJSON
              data={responses}
              fileName={`study-${studyId}-responses`}
              />
              </div>
          ) : (
            <button className={styles.exportButton} disabled>
              Download as JSON
            </button>
          )}
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