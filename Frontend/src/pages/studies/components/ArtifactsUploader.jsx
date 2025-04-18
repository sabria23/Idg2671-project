import React, {useState} from 'react';
import axios from 'axios';
import styles from '../styles/ArtifactUpload.module.css';


const ArtifactsUploader = ({ selectedFiles, setSelectedFiles }) => {

    const [fileType, setFileType] = useState('image');
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploading, setUploading] = useState(false);

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
            files.forEach((file) => formData.append('artifacts', file));

            // Replace with correct API endpoint if different
            await axios.post('/api/artifacts', formData);

            setUploadStatus('Upload successful!');
            setSelectedFiles([...selectedFiles, ...files]);
            setFiles([]);
        } catch (error) {
            console.error(error);
            setUploadStatus('Error uploading artifacts.');
        } finally {
            setUploading(false);
        }
    };

    return(
            <div className={styles['uploadArtifact-container']}>
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
            
    );
};

export default ArtifactsUploader;

