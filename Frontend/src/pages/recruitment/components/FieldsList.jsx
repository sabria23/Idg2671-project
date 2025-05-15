import React from 'react';
import styles from "../../../styles/Demographics.module.css";
/*
This component displays a list of demographic fields and provides a way to remove individual fields. 
It's a "display" component that receives data and callback functions from its parent.*/
/*Props = The component receives two props:

1. fields: An array of field objects to display
2. onRemoveField: A function to call when a user wants to remove a field*/

const FieldsList = ({ fields, onRemoveField }) => {
  // If there are no fields to display, show a message
  if (fields.length === 0) {
    return <p className={styles.emptyMessage}>No demographic fields configured. Add fields below.</p>;
  }

  return (
    <ul className={styles.fieldsList}>
      {/*Uses the .map() array method to transform each field object into a list item Uses the key prop for React's reconciliation process All items are wrapped in a semantic <ul> element*/}
      {fields.map((field, index) => (
        <li key={index} className={styles.fieldItem}>
          <div className={styles.fieldInfo}>
            {/* Field name */}
            <div className={styles.fieldHeader}>
              <strong className={styles.fieldName}>{field.name}</strong>
              <span className={styles.fieldType}>
                {field.type === 'text' }
                {field.type === 'number' }
                {field.type === 'select' }
                {field.type}
              </span>
            </div>
            
            {/* Field details */}
            <div className={styles.fieldDetails}>
              {/* Show options for select fields */}
              {field.type === 'select' && field.options.length > 0 && (
                <div className={styles.fieldOptions}>
                  <span className={styles.optionsLabel}>Options:</span>
                  <span className={styles.optionsList}>
                    {field.options.join(', ')}
                  </span>
                </div>
              )}
              
              {/* Show badge if field is required */}
              {field.required && (
                <span className={styles.requiredBadge}>Required</span>
              )}
            </div>
          </div>
          
          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemoveField(index)}
            className={styles.removeButton}
            aria-label={`Remove ${field.name} field`}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FieldsList;