import { useState, useEffect } from 'react';

const Checkbox = ({ question, externalValue, onExternalChange }) => {
  const [selected, setSelected] = useState(externalValue || []);

  useEffect(() => {
    setSelected(externalValue || []);
  }, [externalValue]);

  const handleToggle = (value) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    setSelected(updated);
    if (onExternalChange) onExternalChange(updated);
  };

  return (
    <div className="question-options">
      {question.options.map((option, index) => (
        <div key={index}>
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            value={option.value}
            checked={selected.includes(option.value)}
            onChange={() => handleToggle(option.value)}
          />
          <label htmlFor={`checkbox-${index}`}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default Checkbox;
