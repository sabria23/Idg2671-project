import React from 'react';
import '../../../styles/artifactDisplay.css'; // optional CSS file

const ArtifactDisplay = ({ fileContent = [] }) => {
  if (!Array.isArray(fileContent) || fileContent.length === 0) {
    return null; // no artifacts to show
  }

  return (
    <div className="artifact-grid">
      {fileContent.map((file, idx) => {
        switch (file.fileType) {
          case 'image':
            return (
              <div key={file._id || idx} className="artifact-item">
                <img src={file.fileUrl} alt={`Artifact ${idx + 1}`} className="artifact-image" />
              </div>
            );
          case 'video':
            return (
              <div key={file._id || idx} className="artifact-item">
                <video controls src={file.fileUrl} className="artifact-video" />
              </div>
            );
          case 'audio':
            return (
              <div key={file._id || idx} className="artifact-item">
                <audio controls src={file.fileUrl} className="artifact-audio">
                  Your browser does not support the audio tag.
                </audio>
              </div>
            );
          case 'text':
            return (
              <div key={file._id || idx} className="artifact-item">
                <iframe src={file.fileUrl} className="artifact-text" title={`Text ${idx + 1}`} />
              </div>
            );
          default:
            return (
              <div key={file._id || idx} className="artifact-item">
                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">Download File</a>
              </div>
            );
        }
      })}
    </div>
  );
};

export default ArtifactDisplay;
