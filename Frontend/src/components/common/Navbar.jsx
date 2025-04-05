import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Navbar.module.css'; 

// A more flexible Navbar that accepts an array of navigation items
function Navbar({ title, navItems, onLogout, className }) {
  return (
    <nav className={`${styles.navbar} ${className || ''}`}>
      <div className={styles.logo}>{title || "StudyPlatform"}</div>
      <div className={styles.navLinks}>
        {/* Map through the navigation items provided */}
        {navItems.map((item, index) => (
            // react.grament is the same as <>, we need to use key={index} prop which is needed in the map funciton
          <React.Fragment key={index}>
            {item.path ? (
              // If the item has a path, render it as a Link
              <Link to={item.path}>
                <button className={styles.navButton}>{item.label}</button>
              </Link>
            ) : (
              // If no path, it's likely an action button like logout
              <button 
                className={styles.navButton} 
                onClick={item.action || onLogout}
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;