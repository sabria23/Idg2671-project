import Study from "../Models/studyModel.js";
// Helper function to check if user is authorized to access a study on dashboard
const checkStudyAuthorization = async (studyId, userId, action = "access") => {
    const study = await Study.findById(studyId);
    
    if (!study) {
      const error = new Error('Study not found');
      error.statusCode = 404;
      throw error;
    }

      //check if the logged-in user is the creator of the study
        // the study.creator menaing study colelction attribute creator, toString convert the ID to string,
        // req.user._id => menainf find the request parameter from the user collection's id generetd by mongodb
        // set it also to string (ha begge som string i tilfelle en er stringog en er object sånn at == faktisk fungere som er like)
    
    if (study.creator.toString() !== userId.toString()) {
      const error = new Error(`Not authorized to ${action} this study`);
      error.statusCode = 403;
      throw error;
    }
    
    return study;
  };

  export default checkStudyAuthorization;