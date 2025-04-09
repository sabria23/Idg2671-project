import { deleteStudy } from "../../../services/studyService";
import { handleApiError } from "../../../utils/errorHandler";

const handleRename = (studyId, newName) => {
    // Implement rename logic
    console.log(`Renaming study ${studyId} to ${newName}`);
    // You might want to call an update service method here
};

const handleEdit = (studyId) => {
    navigate(`/study/${studyId}`)
};

export const handleDelete = async (studyId, setStudies, setLoading, setError) => {
    try {
        setLoading(true);
        await deleteStudy(studyId);
        // very ncie article: https://www.freecodecamp.org/news/javascript-array-filter-tutorial-how-to-iterate-through-elements-in-an-array/
        // using map to mark all studies that should remain
        const shouldKeep = studies.map(study => study._id !== studyId);
        // filter will create new array with only studies that need to be kept
        // underscore is called placeholder which basically means; a param you dont want to use
        //_ => jsut use its index not an object
        // while the index is the position of the array
        const updateStudies = studies.filter((_, index) => shouldKeep[index]);
        setStudies(updateStudies);

    } catch (error) {
        handleApiError(error, setError, "failed to delete study. Please try again");
    } finally {
        setLoading(false);
    }
};

// this funciton handles exporitng a tsudy to the export result page
//this allows the export page to load the correct study data by its specific ID
const handleExport = (studyId) => {
  navigate(`/export-results/${studyId}`);
};