import React from 'react';
import styles from '../styles/ProgressIndicator.module.css';
// https://www.youtube.com/watch?v=1h34uJq7YpA
const ProgressIndicator = ({ currentStep, steps }) => {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.stepsWrapper}>
        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        {/* Step Circles */}
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`${styles.step} ${
              index < currentStep ? styles.completed : 
              index === currentStep ? styles.active : ''
            }`}
          >
            <div className={styles.stepNumber}>{index + 1}</div>
            <div className={styles.stepLabel}>{step}</div>
          </div>
        ))}
      </div>
      
      <div className={styles.currentStepIndicator}>
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </div>
    </div>
  );
};

export default ProgressIndicator;