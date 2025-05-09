import Artifact from '../Models/artifactModel.js';
import mongoose from 'mongoose';
import checkStudyAuthorization from '../Utils/authHelperFunction.js';

//------------------POST(CREATE)-------------------------
// Upload general artifacts
const uploadGeneralArtifacts = async (req, res, next) =>{
  console.log('req.files:', req.files);
  console.log('req.body:', req.body)  

  try{
    if(!req.files || req.files.length === 0){
      console.log('No files received by multer')
      return res.status(400).json({ message: 'No files uploaded'});
    }

    const artifacts =[];

    for(const file of req.files){
      let fileType = 'other';
        if (file.mimetype.startsWith('image/')) fileType = 'image';
        else if (file.mimetype.startsWith('video/')) fileType = 'video';
        else if (file.mimetype.startsWith('audio/')) fileType = 'audio';
        else if (file.mimetype.startsWith('text/') || file.mimetype === 'application/pdf') fileType = 'text';

        const artifact = new Artifact({
          uploadedBy: req.userId || null,
          fileName: file.originalname,
          fileType: fileType,
          fileData: file.buffer
        });
    
        await artifact.save();
        artifacts.push(artifact);
    }

    res.status(201).json({
      success: true,
      message: 'Artifact successfully uploaded',
      data: artifacts.map(a => ({
        id: a._id,
        fileName: a.fileName,
        fileType: a.fileType
      })),
    });
  }catch(err){
    next(err);
  }
}
 
// The code is reused from @modestat's oblig2 in full-stack
// Uploads files from users computer
const uploadArtifact = async (req, res, next) => {
    try {
        const { studyId, questionId } = req.params;
        
        // Check if a file is provided
        if (!req.file || req.files.length === 0) {
            const err = new Error('No file uploaded');
            err.statusCode = 400;
            return next(err);
        }

        // Find the study by id
        const study = await Study.findById(studyId);
        if (!study) {
            const err = new Error('Could not find study');
            err.statusCode = 404;
            return next(err);
        }

        // Find the question by id in the study
        const question = study.questions.id(questionId);
        if (!question) {
            const err = new Error('Could not find question');
            err.statusCode = 404;
            return next(err);
        }

        const artifacts = [];

        // Determine fileType from MIME type
        for (const file of req.files){
        let fileType = 'other';
        if (req.file.mimetype.startsWith('image/')) fileType = 'image';
        else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
        else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';
        else if (req.file.mimetype.startsWith('text/') || req.file.mimetype === 'application/pdf') fileType = 'text';
        
        // Create and save a new artifact
        const artifact = new Artifact({
            uploadedBy: req.userId || null, // Use req.userId for consistency
            fileName: file.originalname,
            fileType: fileType, // Use the determined fileType, not the MIME type
            fileData: file.buffer, // Path from multer
            usedInStudies: [studyId]
        });
        
        await artifact.save();

        artifacts.push(artifact);
        
        if(!question.artifactContent) question.artifactContent = [];

        // Add artifact to a question
        question.artifactContent.push({
            artifactId: artifact._id,
            artifactType: fileType // Use the local fileType variable
        });
    }
        
        await study.save();

        res.status(201).json({ files: artifacts, });
    } catch (err) {
        next(err);
    }
};

//----------------GET----------------
// Get all artifact for pagination, sorting (desc, asc)
const getArtifacts = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'fileName', order = 'desc'} = req.query;
    try{
        const artifacts = await Artifact.find()
            .sort({[sortBy]: order === 'asc' ? 1 : -1})
            .limit(Number(limit))
            .skip((Number(page) -1) * Number(limit))

        res.status(200).json(artifacts);
    } catch(err){
        res.status(500).json({error: err.message});
    }
};

// Get artifact from user
/*const getUserArtifacts = async (req, res) => {
  try{
    const artifacts = await Artifact.find({ uploadedBy: req.userId });
    res.status(200).json(artifacts);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};*/

// Get artifact for viewing
// Displays the artifacts on the create-study page
const getArtifactView = async (req, res) =>{
  try{
    const artifact = await Artifact.findById(req.params.id);

    if(!artifact || !artifact.fileData?.buffer){
      return res.status(404).send('Artifact not found or has no file data');
    }

    res.set('Content-Type', artifact.fileType || 'application/octet-stream');
    return res.send(artifact.fileData);
  }catch (err){
    console.error('Error in getArtifactView:', err);
    return res.status(500).send('Internal server Error');
  }
};

//--------------DELETE----------------------------
// Remove a artifact from a question
// The code is reused from @modestat's oblig2 in full-stack
/*const deleteArtifactFromQuestion = async (req, res, next) => {
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

      const artifactExists = question.artifactContent?.some(
          artifact => artifact.artifactId.toString() === artifactId.toString()
      );
      if (!artifactExists){
          const err = new Error('Could not find artifact in this question');
          err.statusCode = 404;
          return next(err);
      }

      // Remove the file reference from the question
      await Study.updateOne(
          { _id: studyId, 'questions._id': questionId},
          { $pull: { 'questions.$.artifactContent': { artifactId: artifactId } } }
      );

      // Remove the study reference from file
      await Artifact.findByIdAndUpdate(
          artifactId,
          { $pull: { usedInStudies: studyId } }
      );
      res.status(200).json({
          success: true,
          message: 'File removed from question but still kept in artifact library'
      });
  } catch (err){
      res.status(400).json({ error: err.message});
  }
};*/

// Delete the artifact from the collection
const deleteArtifactFromCollection = async (req, res) => {
  try{
      console.log('Attempting to delete artifact with id:', req.params.id);
      const artifact = await Artifact.findById(req.params.id);

      if (!artifact){
        return res.status(404).json({ message: 'Could not find artifact'});
      }

      await artifact.deleteOne();
      res.status(200).json({ message: 'Artifacts successfully deleted'});
  } catch (err){
      console.error('Delete error.', err);
      res.status(500).json({ message: 'Server error' });
  }
};


export const artifactController ={
  uploadGeneralArtifacts,
  uploadArtifact,
  getArtifacts,
  getArtifactView,
  deleteArtifactFromCollection
};



  //getUserArtifacts,
  //deleteArtifactFromQuestion,