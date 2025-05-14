import QuestionTypeWrapper from './QuestionTypeWrapper';
import ArtifactDisplay from './ArtifactDisplay';

import '../../../styles/displaySurvey.css';
  
const SurveyQuestion = ({ currentQuestion, onAnswer, onSkip, onPrevious, onNext }) => {
  if (!currentQuestion) return <div>Loading question...</div>;
  
  return (
    <div className="survey-container">
      <div className="question-container">
        <div className="question-header">
          <h2>{currentQuestion.questionText?.trim() || 'missing question text'}</h2>
        </div>
  
        <ArtifactDisplay fileContent={currentQuestion.fileContent}/>

        <QuestionTypeWrapper
          questionType={currentQuestion.questionType}
          question={currentQuestion}
          onAnswer={onAnswer}/>

        <div className="question-navigation">
          <button className="secondary-button" onClick={onPrevious}>
            Previous
          </button>
          <button className="skip-button" onClick={onSkip}>
            Skip Question
          </button>
          <button className="primary-button" onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
  
export default SurveyQuestion;
  