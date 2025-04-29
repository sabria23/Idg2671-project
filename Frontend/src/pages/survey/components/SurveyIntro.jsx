import '../../../styles/displaySurvey.css';
const SurveyIntro = () => {
    return (
        <div className="survey-container">
            <div className="intro-container">
              <h1>{studyInfo.title || 'Loading...'}</h1>
              <div className="intro-content">
                <p>{studyInfo.description}</p>
                <div className="intro-details">
                  <div className="intro-detail-item">
                    <span className="detail-icon">⏱️</span>
                    <span>Approximately {questions.length * 2} minutes</span>
                  </div>
                  <div className="intro-detail-item">
                    <span className="detail-icon">🔍</span>
                    <span>{questions.length} questions to answer</span>
                  </div>
                </div>
                <button className="primary-button" onClick={() => setCurrentStep(1)}>
                  Start Study
                </button>
              </div>
  
  
              
              <p className="intro-instructions">
                You will be asked to evaluate different artifacts using various rating methods.
                Please follow the instructions for each question carefully.
              </p>
              
              <button className="primary-button" onClick={handleStart}>
                Start Study
              </button>
  
            </div>
        </div>
    );
}
export default SurveyIntro;