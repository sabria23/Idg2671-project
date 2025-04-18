/*import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/Recruitment.module.css';
import Navbar from "../../components/common/Navbar";
import TogglePublish from './components/TogglePublish';
import EmailInvitation from './components/Email.Invitation';
import ProgressIndicator from "./components/ProgressIndicator";


/* THINGS I NEED TO DO TODAY
Toggle a study from draft to published
Generate a shareable link for a published study
Invite participants via email*


const RecruitmentPage = () => {
     // Define the recuritmens workflow steps 1 out 3
    const recruitmentSteps = [
        "Choose recruitment method",
        "Configure settings",
        "Launch"
    ];
     // Track the current step (0-indexed)
    const [currentStep, setCurrentStep] = useState(0);

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
    const handleLogout = () => {
        console.log("Logging out...");
        // Add your logout logic here
    };

    // Navigation items for the Recruitment page
    const recruitmentNavItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Profile", path: "/profile" },
        { label: "Logout", action: handleLogout }
    ];



    return (
        <div className={styles.recruitmentContainer}>
          <Navbar
            title="StudyPlatform"
            navItems={recruitmentNavItems}
            onLogout={handleLogout}
          />
    
          <main className={styles.mainContent}>
            <h1 className={styles.pageTitle}>Recruit Participants for your study</h1>
            
            <ProgressIndicator 
              currentStep={currentStep} 
              steps={recruitmentSteps} 
            />
            
            {currentStep === 0 && (
              <div className={styles.tabNavigation}>
                <EmailInvitation onProceed={goToNextStep} />
                <RecruitLink onProceed={goToNextStep} />
              </div>
            )}
            
            {currentStep === 1 && (
              <div className={styles.configStep}>
                <h2>Configure your recruitment settings</h2>
                {/* Add form fields for configuration *
                <div className={styles.formGroup}>
                  <label>Study details</label>
                  <input 
                    type="text"
                    placeholder="Study title (shown to participants)"
                    className={styles.formInput}
                  />
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
                {/* Add review content here *
                <div className={styles.reviewItem}>
                  <h3>Recruitment method</h3>
                  <p>Link sharing</p>
                </div>
                
                <div className={styles.buttonContainer}>
                  <button 
                    className={styles.backButton} 
                    onClick={goToPreviousStep}
                  >
                    Back
                  </button>
                  <button className={styles.launchButton}>
                    Launch Recruitment
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      );
    };
  
    export default RecruitmentPage;
   */
    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import styles from '../../styles/Recruitment.module.css';
    import Navbar from "../../components/common/Navbar";
    //import RecruitLink from './components/RecruitLink';
    import EmailInvitation from './components/Email.Invitation';
    import ProgressIndicator from "./components/ProgressIndicator";
    import TogglePublish from './components/TogglePublish';
    import { getStudyById } from '../../services/studyService';
    import { logoutUser } from '../../services/authService';
    
    const RecruitmentPage = () => {
      // Get studyId from URL parameters
      const { studyId } = useParams();
      const navigate = useNavigate();
      
      // State for study details
      const [study, setStudy] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      
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
      
      const handleLogout = () => {
        logoutUser();
        navigate('/login');
      };
    
      // Navigation items for the Recruitment page
      const recruitmentNavItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Profile", path: "/profile" },
        { label: "Logout", action: handleLogout }
      ];
    
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
          <Navbar
            title="StudyPlatform"
            navItems={recruitmentNavItems}
            onLogout={handleLogout}
          />
    
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
                <EmailInvitation onProceed={goToNextStep} studyId={studyId} />
                {/*<RecruitLink onProceed={goToNextStep} studyId={studyId} />*/}
              </div>
            )}
            
            {currentStep === 1 && (
              <div className={styles.configStep}>
                <h2>Configure your recruitment settings</h2>
                {/* Add form fields for configuration */}
                <div className={styles.formGroup}>
                  <label>Study details</label>
                  <input 
                    type="text"
                    placeholder="Study title (shown to participants)"
                    className={styles.formInput}
                    defaultValue={study?.title}
                  />
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
                {/* Add review content here */}
                <div className={styles.reviewItem}>
                  <h3>Recruitment method</h3>
                  <p>Link sharing</p>
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
                
                <div className={styles.buttonContainer}>
                  <button 
                    className={styles.backButton} 
                    onClick={goToPreviousStep}
                  >
                    Back
                  </button>
                  <button 
                    className={styles.launchButton} 
                    disabled={!study?.published}
                  >
                    Launch Recruitment
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      );
    };
    
    export default RecruitmentPage;