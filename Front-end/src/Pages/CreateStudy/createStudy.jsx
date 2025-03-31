import React, { useState } from 'react';
import NavBar from '../../Components/NavBar.jsx';
import axios from 'axios';


const CreateStudyPage = () => {
    const [studyTitle, setStudyTitle] = useState('');
    const [studyDescription, setStudyDescription] = useState('');
    const [questions, setQuestions] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [questionType, setQuestionType] = useState('multiple-choice');

    // Handle input for study title and description
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(name === 'title'){
            setStudyTitle(value);
        } else if(name === 'description'){
            setStudyDescription(value);
        }
    };

    const handleFileChange = (e) =>{
        setSelectedFiles(e.target.files);
    };

    // Handle file upload
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: '',
                questionType: 'questionType',
                fileContent: null,
                options: [],
            },
        ]);
    };


    // Handle question text change
    const handleQuestionTextChange = (index, value) =>{
        const updatedQuestions = [...questions];
        updatedQuestions[index].text = value;
        setQuestions(updatedQuestions);
    };

    // Handle saving the form data(study, questions, files)
    const handleSave = async() =>{
        const formData = new FormData();
        formData.append('title', studyTitle);
        formData.append('description', studyDescription);

        for(let i = 0; i < selectedFiles.length; i++){
            formData.append('files', selectedFiles[i]);
        }

        formData.append('questions', JSON.stringify(questions));

        try{
            await axios.post('/api/studies', formData);
            alert('Study successfully created!');
        } catch (err){
            console.error(err);
            alert('Error creating study');
        }
    };

return (
    <>
    <NavBar />
            <div>
                <h1>Create a new study</h1>
                <p>Fill out the details below and save to see the created study on dashboard</p>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>Study Title:</label>
                    <input 
                        type='text'
                        name='title'
                        value={studyTitle}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label>Study Description:</label>
                    <textarea 
                        name='description' 
                        value={studyDescription}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label>Upload Artifact:</label>
                    <input 
                        type='file'
                        multiple
                        onChange={handleFileChange}
                        accept='.pdf, .doc, .jpg, .jpeg, .png, .gif, .txt' 
                    />
                    <br />
                    <button onClick={addQuestion}>Add Question</button>
                    <div>
                        {questions.map((question, index) => (
                            <div key={index}>
                                <input 
                                    type='text'
                                    placeholder='Enter question text'
                                    value={question.text}
                                    onChange={(e) =>
                                        handleQuestionTextChange(index, e.target.value)
                                    } 
                                />
                                <select
                                    onChange={(e) =>
                                        setQuestionType(e.target.value)
                                    }
                                    value={questionType}
                                >
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="open-ended">Open Ended</option>
                                </select>
                                <br />
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSave}>Save Study</button>
                </form>
            </div>
        </>
    );    
};
export default CreateStudyPage;
