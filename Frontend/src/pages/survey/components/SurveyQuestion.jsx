import QuestionTypeWrapper from './QuestionTypeWrapper';
import ArtifactDisplay from './ArtifactDisplay';
import '../../../styles/displaySurvey.css';

const SurveyQuestion = ({
  currentQuestion,
  onAnswer,
  onSkip,
  onPrevious,
  onNext,
  isLast
}) => {
  if (!currentQuestion) return <div>Loading question…</div>;

  return (
    <div className="survey-container">
      <div className="question-container">
        <div className="question-header">
          <h2>{currentQuestion.questionText?.trim() || 'Missing question text'}</h2>
        </div>

        <QuestionTypeWrapper
          key={currentQuestion._id}                         // ← force a fresh mount per question
          questionType={currentQuestion.questionType}
          question={currentQuestion}
          defaultValue={currentQuestion.previousAnswer || null}     // ← prefill with whatever you saved
          onAnswer={onAnswer}
        />

        <div className="question-navigation">
          <button className="secondary-button" onClick={onPrevious}>
            Previous
          </button>
          <button className="skip-button" onClick={onSkip}>
            Skip Question
          </button>
          <button className="primary-button" onClick={onNext}>
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyQuestion;