import Study from '../Models/studyModel.js';
import Artifact from '../Models/artifactModel.js';

//----------------POST(CREATE)----------------------------
// Create a new study
const createStudy = async (req, res) => {
    try {
        const study = new Study({
            creator: req.user ? req.user._id: userId,
            title: req.title,
            description: req.description,
            published: req.published,
            questions: req.questions
        });
        await study.save();
        res.status(201).json({ message: 'A new study successfully created!'})
    } catch (err){
        res.status(400).json({ err: err.message});
    }
};

// Upload artifacts
// The code is reused from @modestat's oblig2 in full-stack
const uploadArtifact = async (req, res, next) => {
    try {
        if (!req.file){
            const err = new Error('Could not upload file');
            err.statusCode = 400;
            return next(err);
        }

        const { studyId, questionId } = req.params;

        // Find the quiz and question
        const study = await Study.findById(studyId);
        if (!study) {
            const err = new Error('Could not find study');
            err.statusCode = 404;
            return next(err);
        }
        
        const question = study.questions.id(questionId);
        if (!question) {
            const err = new Error('Could not find question');
            err.statusCode = 404;
            return next(err);
        }

        // Create and save a new artifact
        const artifact = new Artifact({
            uploadedBy: req.user ? req.user._id : undefined,
            fileName: req.file.originalname,
            fileType: req.fileType,
            filePath: req.file.path,
            usedInStudies: req.study ? req.study._id : undefined
        });
        await artifact.save();

        // Add artifact to a question
        question.artifactContent.push({
            artifactId: artifact._id,
            artifactUrl: `/${req.file.path.replace(/\\/g, '/')}`,
            artifactType: req.fileType
        });
        await quiz.save();

        // Add study reference to artifacts collection
        artifact.usedInStudies.push(studyId);
        await artifact.save();

        res.status(201).json({
            success: true,
            message: 'Artifact successfully uploaded',
            data: {
                id: artifact._id,
                fileName: artifact.fileName,
                fileType: artifact.fileType,
                filePath: artifact.filePath
            }
        });
    } catch (err){
        next(err);
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

// Get all artifact for pagination, sorting (desc, asc)
const getArtifacts = async (req, res) => {
    try{
        const { page = 1, limit = 10, sortBy = 'fileName', order = 'desc'} = req.query;
        const artifacts = await Artifact.find()
            .sort({[sortBy]: order === 'asc' ? 1 : -1})
            .limit(Number(limit))
            .skip((Number(page) -1) * Number(limit))

        res.status(200).json(artifacts);
    } catch(err){
        res.status(500).json({error: err.message});
    }
};

//----------------PATCH(UPDATE)-----------------------------
// Updating the study's title, answer options, desc etc
// Reuses code from @emilirol's oblig2 in full-stack
const patchStudyById = async (req, res) => {
    try{
        const updateStudy = await Study.findByIdAndUpdate(req.params.quizId, req.body, {new: true});
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
// Remove a artifact from a question
// The code is reused from @modestat's oblig2 in full-stack
const deleteArtifactFromQuestion = async (req, res) => {
    try{
        const { studyId, questionId, artifactId } = req.params;

        // Verify that the resources exist
        const study = await Study.findById(studyId);
        if (!study) {
            const err = new Error('Could not find study');
            err.statusCode = 404;
            return next(err);
        }

        const question = study.questions.id(questionId);
        if (!question){
            const err = new Error ('Could not find question');
            err.statusCode = 404;
            return next(err);
        }

        const artifactExists = question.artifactContent.some(
            artifact => artifact.artifactId.toString() === fileId
        );

        if (!artifactExists){
            const err = new Error('Could not find artifact in this question');
            err.statusCode = 404;
            return next(err);
        }

        // Remove the file reference from the question
        await Study.updateOne(
            { _id: studyId, 'questions._id': questionId},
            { $pull: { 'questions.$.artifactContent': { artifactId: fileId } } }
        );

        // Remove the study reference from file
        await Artifact.findByIdAndUpdate(
            fileId,
            { $pull: { usedInStudies: studyId } }
        );
        res.status(200).json({
            success: true,
            message: 'File removed from question but still kept in artifact library'
        });
    } catch (err){
        next(err);
    }
};

// Delete the artifact from the collection
const deleteArtifactFromCollection = async (req, res) => {
    try{
        const deleteArtifact = await Artifact.findByIdAndDelete(req.params.artifactId);
        if (!deleteArtifact) return res.status(404).json({ message: 'Could not find artifact'});
        res.json({ message: 'Artifacts successfully deleted'});
    } catch (err){
        res.status(400).json({ error: err.message});
    }
};

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


export const studyController ={
    createStudy,
    uploadArtifact,
    createQuestion,
    createQuestion,
    getStudyById,
    getArtifacts,
    patchStudyById,
    patchQuestionById,
    deleteArtifactFromQuestion,
    deleteArtifactFromCollection,
    deleteQuestionById
};