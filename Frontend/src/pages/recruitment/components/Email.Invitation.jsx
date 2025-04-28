import React, { useState } from 'react';
import { MdEmail, MdAdd, MdClose } from 'react-icons/md';
import styles from '../../../styles/Recruitment.module.css';
import studyService from '../../../services/studyService';

const EmailInvitation = ({ studyId, onProceed, setRecruitmentData }) => {
  const [emails, setEmails] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle email input change
  const handleEmailChange = (index, value) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  // Add a new email field
  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  // Remove an email field
  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const updatedEmails = [...emails];
      updatedEmails.splice(index, 1);
      setEmails(updatedEmails);
    }
  };

  // Validate emails
  const validateEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Filter out empty emails
    const filteredEmails = emails.filter(email => email.trim() !== '');
    
    if (filteredEmails.length === 0) {
      setError('Please add at least one email address');
      return false;
    }
    
    // Check for invalid email formats
    const invalidEmails = filteredEmails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      setError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return false;
    }
    
    return filteredEmails;
  };

  // Proceed to configuration step with valid emails
  const proceedToConfiguration = () => {
    const validEmails = validateEmails();
    if (!validEmails) return;
    
    // Store emails in parent component for later use
    setRecruitmentData(prevData => ({
      ...prevData,
      emails: validEmails,
      recruitmentMethod: 'email'
    }));
    
    // Move to the next step
    onProceed();
  };

  return (
    <div className={styles.recruitmentOption}>
      <div className={styles.optionIcon}>
        <span className={styles.iconEmoji}>
          <MdEmail size={24} />
        </span>
      </div>
      <div className={styles.optionDetails}>
        <h2 className={styles.optionTitle}>
          Recruit on your own
        </h2>
        <p>Find participants manually by adding emails to invite them to your study.</p>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <div className={styles.emailForm}>
          {emails.map((email, index) => (
            <div key={index} className={styles.emailInputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="Enter email address"
                className={styles.emailInput}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => removeEmailField(index)}
                className={styles.removeButton}
                disabled={emails.length === 1 || isLoading}
              >
                <MdClose />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addEmailField}
            className={styles.addButton}
            disabled={isLoading}
          >
            <MdAdd /> Add Another Email
          </button>
        </div>
        
        <button 
          className={styles.optionButton}
          onClick={proceedToConfiguration}
          disabled={isLoading}
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <MdEmail className={styles.buttonIcon}/> Continue with Emails
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailInvitation;