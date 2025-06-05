import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../styles/Export.module.css';
import studyService from "../../services/studyService";
import ExportDropdown from './components/ExportDropdown';
import { getResponseCount } from "../../utils/responseUtils.js";

const ExportPage = () => {
  const { studyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [responseCount, setResponseCount] = useState(0);
  const [studyDetails, setStudyDetails] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
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
  
  useEffect(() => {
    const fetchResponseCount = async () => {
      if (studyId) {
        const count = await getResponseCount(studyId);
        setResponseCount(count);
      }
    };
    
    fetchResponseCount();
  }, [studyId]);

  const getDemographicFields = () => {
    const fields = new Set();
    responses.forEach(response => {
      if (response.demographics) {
        if (response.demographics instanceof Map) {
          for (const key of response.demographics.keys()) {
            fields.add(key);
          }
        } else if (typeof response.demographics === 'object') {
          Object.keys(response.demographics).forEach(key => {
            fields.add(key);
          });
        }
      }
    });
    return Array.from(fields).sort();
  };

  const getDemographicValue = (response, field) => {
    if (!response.demographics) return '';
    
    if (response.demographics instanceof Map) {
      return response.demographics.get(field) || '';
    } else if (typeof response.demographics === 'object') {
      return response.demographics[field] || '';
    }
    
    return '';
  };

  if (loading) {
    return <div className={styles.loadingIndicator}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.exportPage}>
      <div className={styles.exportHeader}>
        <h1>Export Study Results</h1>
        {responses.length > 0 && (
          <div className={styles.exportActions}>
            <ExportDropdown
              data={responses}
              fileName={`study-${studyId}-responses`}
            />
          </div>
        )}
      </div>
      
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Status</span>
          <span className={styles.statValue}>Draft</span>
        </div>
        
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Participants</span>
          <span className={styles.statValue}>{responses.length || 0}</span>
        </div>
        
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Responses</span>
          <span className={styles.statValue}>{responseCount || 0}</span>
        </div>
      </div>
      
      {responses.length > 0 && (
        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h2>Data Preview</h2>
            <button 
              className={styles.toggleButton} 
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showPreview && (
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Status</th>
                    {getDemographicFields().map(field => (
                      <th key={field}>{field}</th>
                    ))}
                    <th>Responses</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.slice(0, 5).map((response, index) => (
                    <tr key={index}>
                      <td>Participant {index + 1}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${response.isCompleted ? styles.completed : styles.inProgress}`}>
                          {response.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      {getDemographicFields().map(field => (
                        <td key={field}>{getDemographicValue(response, field)}</td>
                      ))}
                      <td>{response.responses?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {responses.length > 5 && (
                <div className={styles.tableFooter}>
                  Showing 5 of {responses.length} participants. Export data to see all.
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {responses.length === 0 && !loading && (
        <div className={styles.noData}>
          <p>No participant data available yet.</p>
        </div>
      )}
    </div>
  );
};

export default ExportPage;