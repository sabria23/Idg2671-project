import React, { useState, useEffect } from 'react';
import styles from "../../../styles/Demographics.module.css";
import AddFieldForm from './AddFieldForm';
import FieldsList from './FieldsList.jsx';
import studyService from '../../../services/studyService';

const DemographSettings = ({ studyId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // State for demographics configuration
  const [enabled, setEnabled] = useState(true);
  const [fields, setFields] = useState([]); // 1. the parent (demographics component) manages the list of fields in its state
  
  // Fetch demographics configuration
  useEffect(() => {
    const fetchDemographics = async () => {
      try {
        setLoading(true);
        const config = await studyService.getDemographicsSettings(studyId);
        
        if (config) {
          setEnabled(config.enabled);
          setFields(config.fields || []);
        }
      } catch (err) {
        console.error('Error fetching demographics config:', err);
        setError('Failed to load demographics settings');
      } finally {
        setLoading(false);
      }
    };
    
    if (studyId) {
      fetchDemographics();
    }
  }, [studyId]);
  
  // Toggle demographics on/off
  const handleToggleDemographics = () => {
    setEnabled(!enabled);
  };
  
  // 2. the parent defines a function to update its own state form the useState above
  const addFieldToList = (fieldData) => {
    setFields([...fields, fieldData]);
    setError(null);
  };
  
  // Remove field => this is conencted with child compoennt called fieldsList.jsx
  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };
  
  // Save configuration => this one uses POSt method to save to db
  const handleSaveConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await studyService.updateDemographicsSettings(
        studyId,
        { enabled, fields }
      );
      
      if (response.success) {
        setSuccess('Demographics settings saved successfully');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error saving demographics config:', err);
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && fields.length === 0) {
    return <div className={styles.loadingState}>Loading demographics settings...</div>;
  }
  
  return (
    <div className={styles.demographicsContainer}>
      <h2>Demographics Collection</h2>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      
      {/* Toggle all demographics on/off */}
      <div className={styles.toggleContainer}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggleDemographics}
            className={styles.toggleInput}
          />
          <span className={styles.toggleText}>
            Collect demographics information from participants
          </span>
        </label>
      </div>
      
      {/* Only show field configuration if demographics are enabled */}
      {enabled && (
        <>
          {/* Display current fields */}
          <div className={styles.fieldsContainer}>
            <h3>Current Fields</h3>
            <FieldsList 
              fields={fields} 
              onRemoveField={handleRemoveField} 
            />
          </div>
          
          {/* Add custom fields 3. in the render section, parent passes this function (step 2.) to the child */}
          {/* Pass the function to AddFieldForm.jsx as a prop named "onAddField" */}
          <AddFieldForm
            onAddField={addFieldToList}  // ← THIS IS KEY: Passing the function as a prop
            setError={setError}
          />
        </>
      )}
      
      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={handleSaveConfig}
          className={styles.saveButton}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Demographics Settings'}
        </button>
      </div>
    </div>
  );
};

export default DemographSettings;