/*import React from 'react';
import styles from "../../../styles/Recruitment.module.css";

const DemographSettings = ({ published }) => {
  return (
    <>
     <div className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.sectionTitle}>Demographics Collection</h2>
            
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxContainer}>
                <input
                  id="collect-age"
                  type="checkbox"
                  className={styles.checkboxInput}
                  //checked={recruitmentData.demographics.collectAge}
                  onChange={() => {/* toggle collectAge *
                />
                <label htmlFor="collect-age" className={styles.checkboxLabel}>Collect participant age</label>
              </div>
            </div>
            
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxContainer}>
                <input
                  id="collect-gender"
                  type="checkbox"
                  className={styles.checkboxInput}
                  //checked={recruitmentData.demographics.collectGender}
                  onChange={() => {/* toggle collectGender *
                />
                <label htmlFor="collect-gender" className={styles.checkboxLabel}>Collect participant gender</label>
              </div>
            </div>
            
            <div className={styles.buttonContainerRight}>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={!published}
              >
                Save Demographics Settings
              </button>
            </div>
          </div>
        </div>
    </>
  )
}

export default DemographSettings*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../../../styles/Recruitment.module.css";

const DemographSettings = ({ studyId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // State for demographics configuration
  const [enabled, setEnabled] = useState(true);
  const [fields, setFields] = useState([]);
  
  // State for adding new fields
  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    options: '',
    required: false
  });
  
  // Fetch existing configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
          `http://localhost:8000/api/studies/${studyId}/demographics`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success && response.data.demographicsConfig) {
          setEnabled(response.data.demographicsConfig.enabled);
          setFields(response.data.demographicsConfig.fields);
        }
      } catch (err) {
        console.error('Error fetching demographics config:', err);
        setError('Failed to load demographics settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, [studyId]);
  
  // Toggle demographics on/off (Feature #3)
  const handleToggleDemographics = () => {
    setEnabled(!enabled);
  };
  
  // Add new field (Feature #2)
  const handleAddField = () => {
    if (!newField.name.trim()) {
      setError('Field name is required');
      return;
    }
    
    // For select fields, validate options
    if (newField.type === 'select' && !newField.options.trim()) {
      setError('Options are required for select fields');
      return;
    }
    
    const fieldToAdd = {
      name: newField.name.trim(),
      type: newField.type,
      required: newField.required,
      options: newField.type === 'select' 
        ? newField.options.split(',').map(opt => opt.trim())
        : []
    };
    
    setFields([...fields, fieldToAdd]);
    
    // Reset form
    setNewField({
      name: '',
      type: 'text',
      options: '',
      required: false
    });
    
    setError(null);
  };
  
  // Remove field (for both default and custom fields) (Feature #1 & #2)
  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };
  
  // Save configuration
  const handleSaveConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:8000/api/studies/${studyId}/demographics`,
        {
          enabled,
          fields
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSuccess('Demographics settings saved successfully');
      }
    } catch (err) {
      console.error('Error saving demographics config:', err);
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && fields.length === 0) {
    return <div>Loading demographics settings...</div>;
  }
  
  return (
    <div className={styles.demographicsContainer}>
      <h2>Demographics Collection</h2>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      
      {/* Feature #3: Toggle all demographics on/off */}
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
          {/* Feature #1: Current fields (both default and custom) */}
          <div className={styles.fieldsContainer}>
            <h3>Current Fields</h3>
            
            {fields.length === 0 ? (
              <p>No demographic fields configured. Add fields below.</p>
            ) : (
              <ul className={styles.fieldsList}>
                {fields.map((field, index) => (
                  <li key={index} className={styles.fieldItem}>
                    <div className={styles.fieldInfo}>
                      <strong>{field.name}</strong>
                      <span className={styles.fieldType}>
                        Type: {field.type}
                        {field.type === 'select' && field.options.length > 0 && 
                          ` (Options: ${field.options.join(', ')})`}
                      </span>
                      {field.required && <span className={styles.requiredBadge}>Required</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Feature #2: Add custom fields */}
          <div className={styles.addFieldContainer}>
            <h3>Add New Field</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="fieldName">Field Name:</label>
              <input
                type="text"
                id="fieldName"
                value={newField.name}
                onChange={(e) => setNewField({...newField, name: e.target.value})}
                placeholder="e.g., Education Level"
                className={styles.formControl}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="fieldType">Field Type:</label>
              <select
                id="fieldType"
                value={newField.type}
                onChange={(e) => setNewField({...newField, type: e.target.value})}
                className={styles.formControl}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select (Dropdown)</option>
              </select>
            </div>
            
            {newField.type === 'select' && (
              <div className={styles.formGroup}>
                <label htmlFor="fieldOptions">Options (comma-separated):</label>
                <input
                  type="text"
                  id="fieldOptions"
                  value={newField.options}
                  onChange={(e) => setNewField({...newField, options: e.target.value})}
                  placeholder="e.g., High School, Bachelor's, Master's, PhD"
                  className={styles.formControl}
                />
              </div>
            )}
            
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="fieldRequired"
                checked={newField.required}
                onChange={(e) => setNewField({...newField, required: e.target.checked})}
              />
              <label htmlFor="fieldRequired">
                This field is required
              </label>
            </div>
            
            <button
              type="button"
              onClick={handleAddField}
              className={styles.addButton}
            >
              Add Field
            </button>
          </div>
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