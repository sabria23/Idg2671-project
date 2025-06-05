/*import { deleteStudy } from "../../../services/studyService";
import { handleApiError } from "../../../utils/errorHandler";


studyId: The ID of the study you want to delete
setStudies: A state setter function from React's useState hook that updates the list of studies
setLoading: A state setter to control loading indicators
setError: A state setter to handle error messages
studies: The current array of studies (needed to filter out the deleted one) -> defined in reacts useState hook in my dahsborasPage compoennt, later on the my code i use UseEffect where i popluate thsi array with data by using setStudies function with param data -> getAllstudies() function return data from my API which i then store in studies state. *
export const handleDelete = async (studyId, setStudies, setLoading, setError, studies) => {
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
};*/

import { deleteStudy } from "../../../services/studyService";
import { handleApiError } from "../../../utils/errorHandler";


// simplified handleDelete that only requires studyId
export const handleDelete = async (studyId) => {
    try {
        await deleteStudy(studyId);
        return true; 
    } catch (error) {
        console.error("Failed to delete study:", error);
        throw error; 
    }
};