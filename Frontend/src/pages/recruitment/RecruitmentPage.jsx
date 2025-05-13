

/* THINGS I NEED TO DO TODAY
Toggle a study from draft to published
Generate a shareable link for a published study
Invite participants via email*/

   import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/Recruitment.module.css';
import EmailInvitation from './components/Email.Invitation';
import ProgressIndicator from "./components/ProgressIndicator";
import TogglePublish from './components/TogglePublish';
import { getStudyById } from '../../services/studyService';
import studyService from '../../services/studyService';

const RecruitmentPage = () => {
  // Get studyId from URL parameters
  const { studyId } = useParams();
  const navigate = useNavigate();
  
  // State for study details
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingInvitations, setSendingInvitations] = useState(false);
  const [invitationResult, setInvitationResult] = useState(null);
  
  // State for recruitment data
  const [recruitmentData, setRecruitmentData] = useState({
    recruitmentMethod: '',
    emails: [],
    demographics: {
      collectAge: false,
      collectGender: false
    }
  });
  
  // Define the recruitment workflow steps
  const recruitmentSteps = [
    "Choose recruitment method",
    "Configure settings",
    "Launch"
  ];
  
  // Track the current step (0-indexed)
  const [currentStep, setCurrentStep] = useState(0);
  
  // Fetch study details when component mounts
  useEffect(() => {
    const fetchStudy = async () => {
      try {
        // If we don't have a studyId from URL, try to get it from query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const queryStudyId = urlParams.get('studyId');
        
        const id = studyId || queryStudyId;
        
        if (!id) {
          setError("No study selected. Please go back to dashboard and select a study.");
          setLoading(false);
          return;
        }
        
        const studyData = await getStudyById(id);
        setStudy(studyData);
      } catch (err) {
        setError("Failed to load study details. Please try again.");
        console.error("Error fetching study:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudy();
  }, [studyId]);

  const goToNextStep = () => {
    if (currentStep < recruitmentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStatusChange = (newStatus) => {
    // Update local study state when status changes
    if (study) {
      setStudy({
        ...study,
        published: newStatus
      });
    }
  };
  
  const handleDemographicsChange = (field, value) => {
    setRecruitmentData(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [field]: value
      }
    }));
  };
  
  // Send invitations at the Launch step
  const handleLaunchRecruitment = async () => {
    // Only proceed if the study is published
    if (!study.published) {
      setError("Study must be published before launching recruitment");
      return;
    }
    
    if (recruitmentData.recruitmentMethod === 'email' && recruitmentData.emails.length > 0) {
      setSendingInvitations(true);
      
      try {
        // Add demographics settings to the invitation if needed
        const result = await studyService.sendEmailInvitations(
          studyId, 
          recruitmentData.emails
        );
        
        setInvitationResult({
          success: true,
          message: `Successfully sent invitations to ${recruitmentData.emails.length} participants`
        });
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
        
      } catch (err) {
        console.error('Invitation error:', err);
        setInvitationResult({
          success: false,
          message: 'Failed to send invitations. Please try again.'
        });
      } finally {
        setSendingInvitations(false);
      }
    }
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading study details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.recruitmentContainer}>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Recruit Participants for your study</h1>
        {study && <h2 className={styles.studyTitle}>{study.title}</h2>}
        
        {/* Toggle Publish Component */}
       {study && (
          <TogglePublish 
            studyId={studyId} 
            onStatusChange={handleStatusChange} 
          />
        )}
        
        <ProgressIndicator 
          currentStep={currentStep} 
          steps={recruitmentSteps} 
        />
        
        {currentStep === 0 && (
          <div className={styles.tabNavigation}>
            <EmailInvitation 
              onProceed={goToNextStep} 
              studyId={studyId} 
              setRecruitmentData={setRecruitmentData}
            />
          </div>
        )}
        
        {currentStep === 1 && (
          <div className={styles.configStep}>
            <h2>Configure your recruitment settings</h2>
            
            <div className={styles.formGroup}>
              <label>Study details</label>
              <input 
                type="text"
                placeholder="Study title (shown to participants)"
                className={styles.formInput}
                defaultValue={study?.title}
                readOnly
              />
            </div>
            
            {/* Demographics settings */}
           <div className={styles.formGroup}>
              <h3>Demographics Collection (Optional)</h3>
              <p>Select what demographic information you want to collect from participants:</p>
              
              <div className={styles.checkboxGroup}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={recruitmentData.demographics.collectAge}
                    onChange={(e) => handleDemographicsChange('collectAge', e.target.checked)}
                  />
                  Collect Age Information
                </label>
              </div>
              
              <div className={styles.checkboxGroup}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={recruitmentData.demographics.collectGender}
                    onChange={(e) => handleDemographicsChange('collectGender', e.target.checked)}
                  />
                  Collect Gender Information
                </label>
              </div>
            </div>
            
            <div className={styles.buttonContainer}>
              <button 
                className={styles.backButton} 
                onClick={goToPreviousStep}
              >
                Back
              </button>
              <button 
                className={styles.nextButton} 
                onClick={goToNextStep}
              >
                Continue to Review 
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className={styles.reviewStep}>
            <h2>Review and launch</h2>
            
            <div className={styles.reviewItem}>
              <h3>Recruitment method</h3>
              <p>{recruitmentData.recruitmentMethod === 'email' ? 'Email Invitations' : 'Link sharing'}</p>
              {recruitmentData.recruitmentMethod === 'email' && (
                <div className={styles.emailReview}>
                  <p><strong>Email addresses:</strong> {recruitmentData.emails.length} recipients</p>
                  <div className={styles.emailList}>
                    {recruitmentData.emails.map((email, index) => (
                      <span key={index} className={styles.emailTag}>{email}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.reviewItem}>
              <h3>Study Status</h3>
              <p>{study?.published ? 'Published' : 'Draft'}</p>
              {!study?.published && (
                <p className={styles.warningText}>
                  Note: Your study needs to be published before participants can access it.
                </p>
              )}
            </div>
            
            <div className={styles.reviewItem}>
              <h3>Demographics Collection</h3>
              <ul>
                <li>Age: {recruitmentData.demographics.collectAge ? 'Yes' : 'No'}</li>
                <li>Gender: {recruitmentData.demographics.collectGender ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            
            {invitationResult && (
              <div className={`${styles.invitationResult} ${invitationResult.success ? styles.successMessage : styles.errorMessage}`}>
                {invitationResult.message}
              </div>
            )}
            
            <div className={styles.buttonContainer}>
              <button 
                className={styles.backButton} 
                onClick={goToPreviousStep}
              >
                Back
              </button>
              <button 
                className={styles.launchButton} 
                onClick={handleLaunchRecruitment}
                disabled={!study?.published || sendingInvitations}
              >
                {sendingInvitations ? 'Sending Invitations...' : 'Launch Recruitment'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecruitmentPage;

