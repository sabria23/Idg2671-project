// components/dashboard/WelcomeHeader.jsx
import React from 'react';
import styles from '../../../styles/Dash.module.css';

/**
 * Simple component for the welcome header
 */
const WelcomeHeader = ({ username }) => {
  const greeting = () => {
    const hours = new Date().getHours();
    
    if (hours < 12) return "Morning";
    else if (hours >= 12 && hours <= 17) return "Afternoon";
    else return "Evening";
  };
  
  return (
    <h1 className={styles.welcomeHeader}>
      {greeting()}, {username || "user"}
    </h1>
  );
};

export default WelcomeHeader;