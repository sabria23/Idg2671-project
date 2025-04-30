import { useState } from 'react';
import '../../../styles/displaySurvey.css';
const SurveyDemographics = ({demographics, setDemographics, onSubmit, onBack}) => {
  const handleDemographics = (e) => {
    e.preventDefault();
    onSubmit(e);
  };
    return (
        <div className="survey-container">
          <div className="demographics-container">
            <h2>Before we begin</h2>
            <p>Please provide some information about yourself.</p>
            
            <form onSubmit={handleDemographics} className="demographics-form">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  min="0"
                  max="130"
                  value={demographics.age} 
                  onChange={(e) => setDemographics({...demographics, age: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select 
                  id="gender"
                  value={demographics.gender} 
                  onChange={(e) => setDemographics({...demographics, gender: e.target.value})}
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={() => setCurrentStep(0)}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="primary-button"
                  disabled={!demographics.age || !demographics.gender}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      );
}
export default SurveyDemographics;