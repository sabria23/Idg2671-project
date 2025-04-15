/*import React, { useState, useRef, useEffect } from 'react';
import styles from '../../pages/dashboard/styles/DropdownMenu.module.css';
// https://www.freecodecamp.org/news/build-a-dynamic-dropdown-component/
const DropdownMenu = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // https://react.dev/reference/react/useRef
  
  //all code for the useEfefct is important becaseu: Without this code, your dropdown would stay open even when users click elsewhere on the page. They would have to specifically click the dropdown button again to close it, which isn't intuitive.
  // https://www.youtube.com/watch?app=desktop&v=LPStDAophGI
  // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component

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
      {/* https://react.dev/learn/conditional-rendering
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {/* mapping options for buttons*
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

export default DropdownMenu;*/

import React, { useState, useRef, useEffect } from 'react';
import styles from '../../pages/dashboard/styles/DropdownMenu.module.css';

const DropdownMenu = ({ 
  options, 
  buttonLabel = '⋮', // by default but can be overriden when using like this for exmapel: buttonLable="export data"
  buttonClassName, // by default uses buttonClassname styling but can be changes as well
  menuClassName // by default cusotm dropdowm meny styling but can be changed
}) => {
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
        className={buttonClassName || styles.menuButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More options"
      >
        {buttonLabel}
      </button>
      {isOpen && (
        <div className={menuClassName || styles.dropdownMenu}>
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