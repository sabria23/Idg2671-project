const MultipleChoice = ({ question, externalValue, onExternalChange }) => {
  const handleChange = (value) => {
    onExternalChange(value); // send selected value back to SurveyPage
  };

  console.log("[MultipleChoice] fileContent:", question.fileContent);
  return (
    <div className="question-options">
      {question.options.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            id={`option-${index}`}
            name="multipleChoice"
            value={option.value}
            onChange={() => handleChange(option.value)}
          />
          <label htmlFor={`option-${index}`}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default MultipleChoice;