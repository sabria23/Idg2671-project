import React, { useState } from 'react';
import '../../../styles/artifactDisplay.css';

// Subcomponent to handle image loading errors
const ArtifactImage = ({ src }) => {
  const [errored, setErrored] = useState(false);

  if (errored) {
    // Fallback UI when image fails
    return <div className="artifact-error">Image unavailable</div>;
  }

  return (
    <img
      src={src}
      alt="Artifact"
      onError={() => setErrored(true)}
      className="artifact-image"
    />
  );
};

// Main ArtifactDisplay component
const ArtifactDisplay = ({ fileContent = [], small = false }) => {
  if (!fileContent.length) {
    // No artifacts to show, but still render a placeholder to show question
    return <div className="artifact-placeholder">No preview available</div>;
  }

  return (
    <div className={`artifact-grid${small ? ' small' : ''}`}>  
      {fileContent.map((item, idx) => (
        <div key={idx} className="artifact-item">
          <ArtifactImage src={item.fileUrl} />
        </div>
      ))}
    </div>
  );
};

export default ArtifactDisplay;