import React, { useState, useEffect } from 'react';
import '../../../styles/SurveyDemographics.css';

const SurveyDemographics = ({ studyId, sessionId, onSubmit, onBack, demographicsConfig}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => setLoading(false), []);
  useEffect(() => {
    // If demographics are disabled, immediately proceed to the next step
    if (demographicsConfig && !demographicsConfig.enabled) {
      // Skip to next step by submitting empty data
      onSubmit({});
    }
  }, [demographicsConfig, onSubmit]);

   // If demographics are disabled, don't render anything
   if (demographicsConfig && !demographicsConfig.enabled) {
    return null;
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    demographicsConfig.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.name} is required`;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        onSubmit(formData);
      } catch (err) {
        setError('Failed to submit demographics information. Please try again.');
      }
    }
  };

  // Render input field based on field type
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        );

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select an option</option>
            {field.options && field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        );
    }
  };

 
  return (
    <div className="survey-container">
      <div className="survey-content">
        <h2>Demographic Information</h2>
        <p className="survey-instruction">
          Please provide the following information to help with our research. 
          This information will be kept confidential.
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {demographicsConfig.fields && demographicsConfig.fields.map((field, index) => (
            <div key={index} className="form-group">
              <label htmlFor={field.name} className="form-label">
                {field.name} {field.required && <span className="required-mark">*</span>}
              </label>
              {renderField(field)}
              {formErrors[field.name] && (
                <div className="error-message">{formErrors[field.name]}</div>
              )}
            </div>
          ))}
          
          <div className="button-group">
            <button 
              type="button" 
              onClick={onBack} 
              className="btn-secondary"
            >
              Back
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyDemographics;