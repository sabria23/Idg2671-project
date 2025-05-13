import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/Navbar.module.css'; // Keep your existing styles

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear token or any user data from localStorage -> this is not secure so fix in it later
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>StudyPlatform</div>
      <div className={styles.navLinks}>
        <Link to="/dashboard">
          <button className={styles.navButton}>Dashboard</button>
        </Link>
        <Link to="/profile">
          <button className={styles.navButton}>Profile</button>
        </Link>
        <Link to="/create-study">
          <button className={styles.navButton}>Create study</button>
        </Link>
        <button 
          className={styles.navButton} 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;