import { useState } from 'react';

const Checkbox = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState([]);

  const handleToggle = (value) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(updated);
    onAnswer(updated); // send updated array to SurveyPage
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