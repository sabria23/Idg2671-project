import React, { useState } from 'react';
import styles from "../../../styles/Demographics.module.css";
 // this component basically does this: Child's function: Validates form input and calls the parent's function
 /*Parent defines function
Parent passes function to child
Child calls function
Parent's state updates*/
const AddFieldForm = ({ onAddField, setError }) => {
  // State for the new field form
  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    options: '',
    required: false
  });
  
 
  const handleFormSubmit = () => {
    // Validate field name is not empty
    if (!newField.name.trim()) {
      setError('Field name is required'); // The setError function updates the parent's state (lifting state up pattern)
      return;
    }
    
    // For select fields, validate options are provided
    if (newField.type === 'select' && !newField.options.trim()) {
      setError('Options are required for select fields');
      return;
    }
    
    // this is where object creaiton is and data tranformation happens
    const fieldToAdd = {
      name: newField.name.trim(),
      type: newField.type,
      required: newField.required,
      // For select fields, convert comma-separated string to array of options
      options: newField.type === 'select' 
        ? newField.options.split(',').map(opt => opt.trim())
        : []
    };
    
    // Call parent's onAddField function with the new field data
    onAddField(fieldToAdd); // the onAddField points to the parents funciton but takes in niew fields added from child here: const fieldToAdd =, right above it 
    
    // Rreset the state hook for new fields
    setNewField({
      name: '',
      type: 'text',
      options: '',
      required: false
    });
  };
  
  return (
    <div className={styles.addFieldContainer}>
      <h3>Add New Field</h3>
      
      {/* Field Name Input */}
      <div className={styles.formGroup}>
        <label htmlFor="fieldName">Field Name:</label>
        <input
          type="text"
          id="fieldName"
          value={newField.name}
          onChange={(e) => setNewField({...newField, name: e.target.value})}
          placeholder="e.g., Education Level"
          className={styles.formControl}
        />
      </div>
      
      {/* Field Type Selection */}
      <div className={styles.formGroup}>
        <label htmlFor="fieldType">Field Type:</label>
        <select
          id="fieldType"
          value={newField.type}
          onChange={(e) => setNewField({...newField, type: e.target.value})}
          className={styles.formControl}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="select">Select (Dropdown)</option>
        </select>
      </div>
      
      {/* Options Input (Only for select type) */}
      {newField.type === 'select' && (
        <div className={styles.formGroup}>
          <label htmlFor="fieldOptions">Options (comma-separated):</label>
          <input
            type="text"
            id="fieldOptions"
            value={newField.options}
            onChange={(e) => setNewField({...newField, options: e.target.value})}
            placeholder="e.g., High School, Bachelor's, Master's, PhD"
            className={styles.formControl}
          />
        </div>
      )}
      
      {/* Required Field Checkbox */}
      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="fieldRequired"
          checked={newField.required}
          onChange={(e) => setNewField({...newField, required: e.target.checked})}
        />
        <label htmlFor="fieldRequired">
          This field is required
        </label>
      </div>
      
      {/* Add Button */}
      <button
        type="button"
        onClick={handleFormSubmit}
        className={styles.addButton}
      >
        Add Field
      </button>
    </div>
  );
};

export default AddFieldForm;

/*3. The Connection Process (Step by Step)

Definition: Parent defines a function called handleAddField
Passing: Parent passes this function as a prop called onAddField to the child
Reception: Child receives this function as a prop named onAddField
Usage: Child calls this function by writing onAddField(fieldToAdd)

4. What Happens When That Line Executes
When the line onAddField(fieldToAdd) executes:

It's actually calling the parent's handleAddField function
It passes fieldToAdd as an argument to that function
The parent's function then executes, receiving fieldToAdd as fieldData
The parent's function updates its state by adding the new field*/