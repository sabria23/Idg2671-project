import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/DropdownMenu.module.css';

const DropdownMenu = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button 
        className={styles.menuButton} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More options"
      >
        ⋮
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option, index) => (
            <button 
              key={index}
              className={`${styles.dropdownItem} ${option.isDanger ? styles.deleteBtn : ''}`}
              onClick={() => {
                option.action();
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;