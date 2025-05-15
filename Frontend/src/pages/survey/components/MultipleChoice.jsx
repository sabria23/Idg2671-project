const MultipleChoice = ({ question, externalValue, onExternalChange }) => {
  const handleChange = (value) => {
    onExternalChange(value);
  };

  return (
    <div className="question-options">
      {question.options.map((option, index) => (
        <div key={option.value ?? index}>
          <input
            type="radio"
            id={`mc-${question._id}-${index}`}
            name={`mc-${question._id}`}                      // unique per question
            value={option.value}
            checked={externalValue === option.value}         // ← controlled checked
            onChange={() => handleChange(option.value)}
          />
          <label htmlFor={`mc-${question._id}-${index}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default MultipleChoice;