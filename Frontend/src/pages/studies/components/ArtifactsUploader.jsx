import React, {useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ArtifactUpload.module.css';
import { FaRegTimesCircle } from "react-icons/fa";


const ArtifactsUploader = ({ questions, setQuestions, selectedQuestionIndex }) => {
    const [fileType, setFileType] = useState('image');
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

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
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));

            const token = localStorage.getItem('token');

            const response = await axios.post('/api/artifacts', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              },
            });

            await fetchArtifacts();

            console.log('Upload response:', response.data);

            const uploaded = response.data.files.map((artifact, i) => ({
              ...artifact,
              originalFile: files[i],
              linkedToQuestion: false,
            }));

           
            setSelectedFiles(prev => [...prev, ...uploaded]);
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
      try{
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/artifacts', {
          headers:{
            Authorization: `Bearer ${token}`,
          },
        });

        const fetched = (response.data || []).map(file => ({
          ...file,
          originalFile: null,
          linkedToQuestion: false
        }));

        setSelectedFiles(prev => {
          const all = [...prev, ...fetched];
          const unique = [];
          const seen = new Set();
          for (const item of all){
            const id = item._id || item.originalFile?.name;
            if(!seen.has(id)){
              seen.add(id);
              unique.push(item);
            }
          }
          return unique;
        });
      }catch (err){
        console.log('Error fetching artifacts:', err);
      }
    };

    const handleRemoveArtifact = async (artifactId) => {
        if(!artifactId){
          console.warn('No artifact id provided');
          return;
        }
        try{
          const token = localStorage.getItem('token');
          await axios.delete(`/api/artifacts/${artifactId}`, {
            headers:{
              Authorization: `Bearer ${token}`
            }
          });

          setSelectedFiles(prev => prev.filter(f => f._id !== artifactId));

        }catch (err){
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
      const selecetedQuestion = updatedQuestions[selectedQuestionIndex];
      const existingFileContent = selecetedQuestion.fileContent || [];

      const artifact = selectedFiles.find(f => f._id === artifactId);
      if (!artifact) return;

      const isLinked = existingFileContent.some(fc => fc.fileId === artifactId);

      let newFileContent;
      if(isLinked){
        newFileContent = existingFileContent.filter(fc => fc.fileId !== artifactId);
      }else{
        newFileContent = [
          ...existingFileContent,
          {
            fileId: artifact._id,
            fileUrl: `/api/artifacts/${artifact._id}/view`,
            fileType: artifact.fileType || artifact.originalFile?.type || 'unknown'
          }
        ];
      }

      updatedQuestions[selectedQuestionIndex] ={
        ...selecetedQuestion,
        fileContent: newFileContent
      };

      setQuestions(updatedQuestions);
    };

    useEffect(() =>{
      fetchArtifacts();
    }, []);

    return(
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

                {uploadStatus && (
                    <p className={styles['upload-status']}>{uploadStatus}</p>
                )}
            </div>

            {/* Uploaded files display */}
            <div className={styles['uploadedFiles']}>
                <h3>Uploaded artifacts</h3>
                {selectedFiles.length === 0 ? (
                    <p>No artifacts uploaded yet</p>
                ) :(
                    
                    <ul className={styles['uploadedFiles-list']}>
                    {selectedFiles.map((file, index) => {
                        const fileURL = file.originalFile 
                        ? URL.createObjectURL(file.originalFile) 
                        : `/api/artifacts/${file._id}/view`;
                        const fType = (file.originalFile?.type || file.fileType || '').split('/')[0];

                        return (
                            <li
                                key={file._id || index}
                                className={styles['artifact-item']}
                            >
                              <div className={styles['artifact-wrapper']}>
                                {fType === 'image' && (
                                    <img
                                        src={fileURL}
                                        alt={file.fileName || 'Artifact image'}
                                        width="100"
                                        onError={(e) =>{
                                          e.target.style.display = 'none';
                                          console.warn(`Image failed to load for: ${fileURL}`);
                                        }}
                                    />
                                )}
                                {fType === 'video' && (
                                    <video width="250" controls>
                                        <source
                                            src={fileURL}
                                            type={file.type}
                                        />
                                        Your browser does not support
                                        video playback
                                    </video>
                                )}
                                {fType === 'audio' && (
                                    <audio controls>
                                        <source
                                            src={fileURL}
                                            type={file.type}
                                        />
                                        Your browser does not support audio
                                        playback
                                    </audio>
                                )}
                                {(fType === 'text' ||
                                    fType === 'application') && (
                                    <p>
                                        <strong>{file.name}</strong>
                                    </p>
                                )}

                                <button
                                  type="button"
                                  className={styles['removeArtifactIcon']}
                                  onClick={() =>
                                      handleRemoveArtifact(file._id)
                                  }
                                >
                                  <FaRegTimesCircle />
                                </button>
                              </div>

                                {/* Link checkbox */}
                                <div className={styles['artifact-meta']}>
                                  <label>
                                    <input
                                      type='checkbox'
                                      checked={file.linkedToQuestion || false}
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