import '../../../styles/displaySurvey.css';
const SurveyIntro = ({ studyInfo, totalQuestions, onStart, isPreview = false }) => {
  if (!studyInfo) {
    return <div className="survey-container">Loading study information...</div>;
  }
  console.log('[SurveyIntro] studyInfo:', studyInfo);
  return (
    <div className="survey-container">
      <div className="intro-container">
        <h1>{studyInfo.title || 'Loading...'}</h1>
        <div className="intro-content">
          <p>{studyInfo.description || 'No description provided.'}</p>
          <div className="intro-details">
            <div className="intro-detail-item">
              <span className="detail-icon">⏱️</span>
              <span>Approximately {totalQuestions * 1} minutes</span>
            </div>
            <div className="intro-detail-item">
              <span className="detail-icon">🔍</span>
              <span>{totalQuestions} questions to answer</span>
            </div>
          </div>
          <p className="intro-instructions">
            You will be asked to evaluate different artifacts using various rating methods.
            Please follow the instructions for each question carefully.
          </p>
          <button className="primary-button" onClick={onStart}>
            {isPreview ? 'Preview Study' : 'Start Study'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default SurveyIntro;