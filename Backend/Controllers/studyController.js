import mongoose from 'mongoose';
import Study from '../Models/studyModel.js';
import checkStudyAuthorization from '../Utils/authHelperFunction.js';
import { app } from '../server.js';

//----------------POST(CREATE)----------------------------
// Create a new study
const createStudy = async (req, res) => {
  console.log('----- Incoming Request -----');
  console.log('Headers:', req.headers);
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);  // if using multer for files
  console.log('User ID:', req.userId);

    try {
        const { creator, title, description, published } = req.body;
        
        // Use req.userId from the authentication middleware
        // If creator is not provided, use req.userId
        const creatorId = req.user?._id;
    
        // Validate the creator ID
        if (!creatorId) {
            return res.status(400).json({ error: 'Creator ID is required' });
        }
        // No need to check authorization when creating a new study
        // The checkStudyAuthorization is typically used when accessing an existing study
        if(!title || !description){
            return res.status(400).json({ error: 'Title and description are required'});
        }

        let parsedQuestions = [];
          try {
            if (typeof req.body.questions === 'string') {
              parsedQuestions = JSON.parse(req.body.questions);
            } else if (Array.isArray(req.body.questions)) {
              parsedQuestions = req.body.questions;
            }
          } catch(err) {
            return res.status(400).json({ error: 'Invalid format for questions' });
          }
    
        const study = new Study({
            creator: new mongoose.Types.ObjectId(creatorId),
            title,
            description,
            published: published || false,
            questions: parsedQuestions
        });
    
        await study.save();
        
        res.status(201).json({ 
            message: 'A new study successfully created!',
            studyId: study._id
        });
    } catch (err){
        console.error('Study Creation Error:', err);
        res.status(400).json({ err: err.message });
    }
    };

// Create a new question
const createQuestion = async (req, res) => {
    try {
        const{
            studyId,
            questionText,
            questionType,
            fileContent,
            options
        } = req.body;

        const study = await Study.findById(studyId);
        if (!study){
            return res.status(400).json({ message: 'Could not find study'});
        }

        const newQuestion = {
            questionText,
            questionType,
            fileContent,
            options
        };

        study.questions.push(newQuestion);
        await study.save();

        res.status(201).json({ message: 'Question successfully created to the study!'});
    } catch (err){
        res.status(400).json({ err: err.message});
    }
};


//----------------GET-------------------------------------
// Get a single study for editing the study for preview purpose
const getStudyById = async (req, res) => {
    try{
        const study = await Study.findById(req.params.studyId);
        if(!study) return res.status(404).json({ message: 'Could not find study'});
        res.status(200).json(study);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

//----------------PATCH(UPDATE)-----------------------------
// Updating the study's title, answer options, desc etc
// Reuses code from @emilirol's oblig2 in full-stack
const patchStudyById = async (req, res) => {
    try{
        const updateStudy = await Study.findByIdAndUpdate(req.params.studyId, req.body, {new: true});
        if (!updateStudy) return res.status(404).json({ message: 'Could not find study'});

        res.json(updateStudy);
    } catch(err){
        res.status(400).json({error: err.message });
    }
};

// Update a question
// Reused code from @emilirol's oblig2 in full-stack
const patchQuestionById = async (req, res) => {
    try{
        const study = await Study.findById(req.params.studyId);
        if (!study){
            return res.status(404).json({ message: 'Could not find study'});
        }

        // Checks if it exist a question in the study
        if (!study.questions || study.questions.length === 0){
            return res.status(404).json({ message: 'No questions found in this study'});
        }

        const question = study.questions.id(req.params.questionId);

        if (!question){
            return res.status(404).json({ message: 'Could not find the question'});
        }

        Object.assign(question, req.body);

        await study.save();

        res.json(question);
    } catch(err){
        res.status(400).json({ error: err.message});
    }
};

//----------------DELETE----------------------------------
// Delete a question from a study
// Reusing the code from @emilirol's oblig2 in full-stack
const deleteQuestionById = async (req, res) => {
    try{
        const study = await Study.findById(req.params.studyId);
        if (!study) return res.status(404).json({ message: 'Study not found'});

        study.questions = study.questions.filter(q => q._id.toString() !== req.params.questionId);
        await study.save();

        res.json({ message: ' Question successfully deleted from study'});
    } catch (err){
        res.status(400).json({error: err.message});
    }
};

// for demographics 
//
export const getDemographics = async (req, res) => {
  try {
    const { studyId } = req.params;
    
    // Check if user is authorized to access this study
    const study = await Study.findOne({
      _id: studyId,
      creator: req.user._id
    });
    
    if (!study) {
      return res.status(404).json({ 
        success: false, 
        message: 'Study not found or you do not have permission' 
      });
    }
    
    // If no dmeographics exists yet, initialize with defaults
    if (!study.demographics) {
      const defaultConfig = {
        enabled: true,
        fields: [
          {
            name: 'age',
            type: 'number',
            required: false
          },
          {
            name: 'gender',
            type: 'select',
            options: ['female', 'male', 'prefer_not_to_say'],
            required: false
          }
        ]
      };
      
      // Save default config to study
      study.demographics = defaultConfig;
      await study.save();
      
      res.status(200).json({
        success: true,
        demographics: defaultConfig
      });
    } else {
      // Return the existing config
      res.status(200).json({
        success: true,
        demographics: study.demographics
      });
    }
  } catch (error) {
    console.error('Error fetching demographics config:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch demographics configuration' 
    });
  }
};

// Update demographics configuration
export const updateDemographicsConfig = async (req, res) => {
  try {
    const { studyId } = req.params;
    const { enabled, fields } = req.body;
    
    // Check if user is authorized to update this study
    const study = await Study.findOne({
      _id: studyId,
      creator: req.user._id
    });
    
    if (!study) {
      return res.status(404).json({ 
        success: false, 
        message: 'Study not found or you do not have permission' 
      });
    }
    
    // Update demographics config
    study.demographics = {
      enabled: enabled !== undefined ? enabled : true,
      fields: Array.isArray(fields) ? fields.map(field => ({
        name: field.name,
        type: field.type || 'text',
        options: field.options || [],
        required: field.required || false
      })) : []
    };
    
    await study.save();
    
    res.status(200).json({
      success: true,
      message: 'Demographics configuration updated successfully',
      demographics: study.demographics
    });
  } catch (error) {
    console.error('Error updating demographics config:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update demographics configuration' 
    });
  }
};

export const studyController ={
    createStudy,
    createQuestion,
    getStudyById,
    patchStudyById,
    patchQuestionById,
    deleteQuestionById,
    getDemographics,
    updateDemographicsConfig
};