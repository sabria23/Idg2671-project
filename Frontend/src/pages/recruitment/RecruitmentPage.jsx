import React, { useState } from 'react';
import styles from '../../styles/Recruitment.module.css';
import Navbar from "../../components/common/Navbar";
import RecruitLink from './components/RecruitLink';
import EmailInvitation from './components/Email.Invitation';
import ProgressIndicator from "./components/ProgressIndicator";

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
                {/* Add form fields for configuration */}
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
                {/* Add review content here */}
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
   