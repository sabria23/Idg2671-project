const MultipleChoice = ({ question, onAnswer }) => {
  const handleChange = (value) => {
    onAnswer(value); // send selected value back to SurveyPage
  };

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

export default MultipleChoicey;