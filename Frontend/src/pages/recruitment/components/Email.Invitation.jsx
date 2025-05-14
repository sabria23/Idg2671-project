import React, {useState} from 'react';
import axios from 'axios';
import styles from "../../../styles/Recruitment.module.css"

const EmailInvitation = ({studyId}) => {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('Invitation to participate in our research study');
  const [message, setMessage] = useState(`Hello,

We invite you to participate in our research study. Your input is valuable to our research.

Please click the link below to begin the survey:
[Survey Link will be automatically inserted here]

Thank you,
Research Team`);

const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You need to be logged in to send invitations');
        setLoading(false);
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      // Log EXACT values being used
      console.log("=== FRONTEND DEBUG ===");
      console.log("studyId:", studyId);
      console.log("Full URL:", `http://localhost:8000/api/studies/${studyId}/invitations`);
      console.log("Token:", token.substring(0, 10) + "...");
      console.log("Payload:", { emails, subject, message });
      
      const response = await axios.post(
        `http://localhost:8000/api/studies/${studyId}/invitations`,
        { emails, subject, message },
        config
      );
      
      // ...rest of your function
    } catch (err) {
      console.error('Error sending invitations:', err);
      // For Axios errors, log detailed info
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        console.error('Request made but no response received');
        console.error('Request details:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
      
      setError(err.response?.data?.message || 'Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.sectionTitle}>Invite Participants</h2>
            {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="emails" className={styles.formLabel}>
                Email Addresses
              </label>
              <textarea
                id="emails"
                rows="3"
                className={styles.formTextarea}
                placeholder="Enter email addresses (one per line or separated by commas)"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                required
              ></textarea>
              <p className={styles.helperText}>
                Enter up to 50 email addresses at once
              </p>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.formLabel}>
                Email Subject
              </label>
              <input
                type="text"
                id="subject"
                className={styles.formInput}
                placeholder="Invitation to participate in our research study"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>
                Email Message
              </label>
              <textarea
                id="message"
                rows="6"
                className={styles.formTextarea}
                placeholder="Hello,
We invite you to participate in our research study. Your input is valuable to our research.
Please click the link below to begin the survey:
[Survey Link will be automatically inserted here]
Thank you,
Research Team"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              <p className={styles.helperText}>
                The survey link will be automatically added to the email
              </p>
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                type="submit" 
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Invitations'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};


export default EmailInvitation