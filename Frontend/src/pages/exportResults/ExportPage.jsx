import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/Export.module.css';
import studyService from "../../services/studyService";
import ExportDropdown from './components/ExportDropdown';
import { getResponseCount } from "../../utils/responseUtils.js";

// every study is different so different flows and data will be stored, researcher wanst to 
// to know that participant 1 did this, participant 2 did this etc) because then it is more readble, a fileds, think how will the data ne represneted to the researcher
// export more options, basic analytics
const ExportPage = () => {
  const { studyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [responseCount, setResponseCount] = useState(0);
  const [studyDetails, setStudyDetails] = useState(null);
  const navigate = useNavigate();

    // Fetch response data for export
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
  
   // Fetch response count separately using your utility
   useEffect(() => {
    const fetchResponseCount = async () => {
      if (studyId) {
        const count = await getResponseCount(studyId);
        setResponseCount(count);
      }
    };
    
    fetchResponseCount();
  }, [studyId]);



  return (
    <div className={styles.exportContainer}>
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
              {responseCount || 0}
            </div>
            <div className={styles.cardDescription}>
              Responses shown
            </div>
          </div>
        </div>
        
        <div className={styles.exportControls}>
          {responses.length > 0 ? (
             <ExportDropdown
             data={responses}
             fileName={`study-${studyId}-responses`}
           />
          ) : (
           <button className={styles.exportButton} disabled>
             No data to export
           </button>
            )}
          </div>
      </main>
    </div>
  );
};

export default ExportPage;