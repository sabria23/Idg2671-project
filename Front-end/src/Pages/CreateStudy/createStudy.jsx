import React, { useState } from 'react';
import NavBar from '../../Components/NavBar.jsx';
import axios from 'axios';

const CreateStudyPage = () => {
    const [studyTitle, setStudyTitle] = useState("");
    const [studyDescription, setStudyDescription] = useState("");
    const [artifacts, setArtifacts] = useState([]);
    const [questionText, setQuestionText] = useState([]);

    const handleArtifactChange = (e) => {
        setArtifacts(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("studyTitle", studyTitle);
        formData.append("studyDescription", studyDescription);
        if(artifact){
            formData.append("artifactFile", artifact);
        }

        try {
            const res = await axios.post('http://localhost:5000/studies', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
        });
        console.log('Study created', res.data);
    } catch (error) {
        console.error('Error creating study', error);
    }
};

return(
    <div>
        <NavBar />
        <main>
            <h1>Create a new study</h1>
                <p></p>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="studyTitle">Study Title</label>
                <input 
                    type="text" 
                    value={studyTitle}
                    placeholder="Shot descriptive title"
                    onChange={(e) => setStudyTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="studyDescription">Study Description</label>
                <input 
                    type="text" 
                    value={studyDescription} 
                    placeholder="Give a description of what the study will contain"
                    onChange={(e) => setStudyDescription(e.target.value)}
                />
            </div>

        <div>
            <h2>Add Artifacts (Images, Video, Text, Audio)</h2> 
            <select name="artifacts" id="artifactOption">
                <option value="">Select a artifact</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="text">Text</option>
                <option value="audio">Audio</option>
            </select>
            <input type="file" name="artifactFile" onChange={handleArtifactChange}/>
            <button type="submit" onclick="addArtifact()">Add Artifact</button>
            <p></p>
        </div>

        <div>
            <h2>Questions</h2>
            <div>
                {/* Add a button and logic to add a question */}
                <button type="submit">+ Add Question</button>
            </div>
            <div>
                <h2>{/* Render selected question title here*/}</h2>
                <p>{/* Render selected question detailes here*/}</p>
            </div>
            <div>
                <h2>Question Setting</h2>
                <label htmlFor="questionText">Question Text</label>
                <input 
                    type="text" 
                    value={questionText} 
                    placeholder="e.g. Which color do you like the best?"
                    onChange={(e) => setQuestionText(e.target.value)} 
                />
                <label htmlFor="selectedArtifacts">Artifact(s)</label>
                <select name="selectedArtifacts" id="">
                    {/* Populate based on elected atrifacts */}
                    <option value="">Select an artifact</option>
                </select>

                <label htmlFor="questionType">Question Type</label>
                <select name="questionType" id="">
                    {/* Add options for question types */}
                    <option value='multipleChoise'>Multiple Choise</option>
                    <option value='openEnded'>Open Ended</option>
                </select>

                <label htmlFor="multipleChoiseOptions">Multiple Choise Options</label>
                {/* Dynamically ass radio button inputs for options here*/}
                
                <label htmlFor="layoutTemplate">Layout Template</label>
                <select name="layoutTemplate" id="">
                    <option value="rows">Rows</option>
                    <option value="grid">Grid</option>
                </select>
                <p>Choose how artifacts are arranged: rows or grid</p>
                {/* Add additional UI controls as needed*/}
            </div>
        </div>

        <div>
            <button type='submit'>Save Study</button>
            <button type='button'>Preview</button>
        </div>
    </form>
    </main>
    </div>
);
};

export default CreateStudyPage