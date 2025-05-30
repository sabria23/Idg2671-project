import React, { useState, useEffect } from 'react';
import styles from '../styles/ArtifactUpload.module.css';
import artifactUploadService from '../../../services/artifactUploadService';
import { FaRegTimesCircle } from "react-icons/fa";

const ArtifactsUploader = ({ questions, setQuestions, selectedQuestionIndex }) => {
  const [fileType, setFileType] = useState('image');
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileURLs, setFileURLs] = useState({});

  const acceptedArtifactTypes = {
    image: '.jpg, .jpeg, .png, .gif',
    video: '.mp4, .avi, .mov, .wmv',
    audio: '.mp3, .mav, .wav',
    text: '.txt, .pdf, .doc, .docx'
  };

  const handleArtifactTypeChange = (e) => {
    setFileType(e.target.value);
    setFiles([]);
    setUploadStatus('');
  };

  const handleArtifactChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setUploadStatus('');
  };

  const uploadArtifacts = async () => {
    if (files.length === 0) {
      setUploadStatus('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading...');

    try {
      const uploaded = await artifactUploadService.uploadArtifacts(files);

      const enriched = uploaded.map((artifact, i) => ({
        ...artifact,
        originalFile: files[i],
        linkedToQuestion: false,
      }));

      setSelectedFiles(prev => [...prev, ...enriched]);
      setFiles([]);
      setUploadStatus('Upload successful!');
    } catch (error) {
      console.error(error);
      setUploadStatus('Error uploading artifacts.');
    } finally {
      setUploading(false);
    }
  };

  const fetchArtifacts = async () => {
    try {
      const artifacts = await artifactUploadService.fetchAllArtifacts();
      const newFileURLs = {};

      for (const artifact of artifacts) {
        try {
          const blobURL = await artifactUploadService.fetchArtifactById(artifact._id);
          newFileURLs[artifact._id] = blobURL;
        } catch (err) {
          console.error(`Failed to load artifact ${artifact._id}`, err);
        }
      }

      const processed = artifacts.map(file => ({
        ...file,
        originalFile: null,
        linkedToQuestion: false,
      }));

      setSelectedFiles(prev => {
        const all = [...prev, ...processed];
        const unique = [];
        const seen = new Set();
        for (const item of all) {
          const id = item._id || item.originalFile?.name;
          if (!seen.has(id)) {
            seen.add(id);
            unique.push(item);
          }
        }
        return unique;
      });

      setFileURLs(prev => ({ ...prev, ...newFileURLs }));
    } catch (err) {
      console.log('Error fetching artifacts:', err);
    }
  };

  const handleRemoveArtifact = async (artifactId) => {
    if (!artifactId) {
      console.warn('No artifact id provided');
      return;
    }

    try {
      await artifactUploadService.deleteArtifact(artifactId);
      setSelectedFiles(prev => prev.filter(f => f._id !== artifactId));
    } catch (err) {
      console.error('Failed to delete artifact:', err);
    }
  };

  const toggleLinkToQuestion = (artifactId) => {
    const updated = selectedFiles.map(file =>
      file._id === artifactId
        ? { ...file, linkedToQuestion: !file.linkedToQuestion }
        : file
    );
    setSelectedFiles(updated);

    const updatedQuestions = [...questions];
    const selectedQuestion = updatedQuestions[selectedQuestionIndex];
    const existingFileContent = selectedQuestion.fileContent || [];

    const artifact = selectedFiles.find(f => f._id === artifactId);
    if (!artifact) return;

    const isLinked = existingFileContent.some(fc => fc.fileId === artifactId);

    let newFileContent;
    if (isLinked) {
      newFileContent = existingFileContent.filter(fc => fc.fileId !== artifactId);
    } else {
      newFileContent = [
        ...existingFileContent,
        {
          fileId: artifact._id,
          fileUrl: `https://group4-api.sustainability.it.ntnu.no/api/artifacts/${artifact._id}/view`,
          fileType: artifact.fileType || artifact.originalFile?.type || 'unknown'
        }
      ];
    }

    updatedQuestions[selectedQuestionIndex] = {
      ...selectedQuestion,
      fileContent: newFileContent
    };

    setQuestions(updatedQuestions);
  };

  useEffect(() => {
    fetchArtifacts();
  }, []);

  return (
    <div className={styles['uploadArtifact-container']}>
      <div>
        <h2>Artifacts (Video, Image, Text, Audio)</h2>
        <select
          value={fileType}
          onChange={handleArtifactTypeChange}
          disabled={uploading}
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="text">Text</option>
        </select>

        <input
          className={styles['artifact-input']}
          type="file"
          multiple
          onChange={handleArtifactChange}
          accept={acceptedArtifactTypes[fileType]}
          disabled={uploading}
        />

        <button
          className={styles['artifactBtn']}
          type="button"
          onClick={uploadArtifacts}
          disabled={uploading || files.length === 0}
        >
          + Add
        </button>

        <p className={styles['fileSize']}>Maximum allowed file size 10 MB</p>

        {uploadStatus && (
          <p className={styles['upload-status']}>{uploadStatus}</p>
        )}
      </div>

      <div className={styles['uploadedFiles']}>
        <h3>Uploaded artifacts</h3>
        {selectedFiles.length === 0 ? (
          <p>No artifacts uploaded yet</p>
        ) : (
          <ul className={styles['uploadedFiles-list']}>
            {selectedFiles
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((file, index) => {
                const fileURL = file.originalFile
                  ? URL.createObjectURL(file.originalFile)
                  : fileURLs[file._id];

                const fType = (file.originalFile?.type || file.fileType || '').split('/')[0];

                return (
                  <li key={file._id || index} className={styles['artifact-item']}>
                    <div className={styles['artifact-wrapper']}>
                      {fType === 'image' && fileURL && (
                        <img
                          src={fileURL}
                          alt={file.fileName || 'Artifact image'}
                          width="100"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            console.warn(`Image failed to load for: ${fileURL}`);
                          }}
                        />
                      )}
                      {fType === 'video' && fileURL && (
                        <video width="250" controls>
                          <source src={fileURL} type={file.fileType} />
                          Your browser does not support video playback
                        </video>
                      )}
                      {fType === 'audio' && fileURL && (
                        <audio controls>
                          <source src={fileURL} type={file.fileType} />
                          Your browser does not support audio playback
                        </audio>
                      )}
                      {(fType === 'text' || fType === 'application') && (
                        <p className={styles['textFile']}>
                          <strong>{file.fileName}</strong>
                        </p>
                      )}

                      <button
                        type="button"
                        className={styles['removeArtifactIcon']}
                        onClick={() => handleRemoveArtifact(file._id)}
                      >
                        <FaRegTimesCircle />
                      </button>
                    </div>

                    <div className={styles['artifact-addToQuestion']}>
                      <label>
                        <input
                          type="checkbox"
                          checked={
                            questions[selectedQuestionIndex]?.fileContent?.some(fc => fc.fileId === file._id) || false
                          }
                          onChange={() => toggleLinkToQuestion(file._id)}
                          disabled={selectedQuestionIndex === null}
                        />
                        Add to selected question
                      </label>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ArtifactsUploader;
