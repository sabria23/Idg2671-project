import {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import styles from "../../styles/Dash.module.css";
import React from 'react';
import StudyItem from "./components/StudyItem.jsx";
import { getAllStudies, deleteStudy } from "../../services/studyService.js";
import { handleApiError } from "../../utils/errorHandler.js";
import ConfirmationMsg from '../../components/common/ConfirmationMsg.jsx';
import { handleDelete } from './utils/studyActions.js';
import { getCurrentUser, logoutUser } from '../../services/authService.js';


const DashboardPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studies, setStudies] = useState([]); // this is where list of studies fetched from backend will be stored, updated with SetStudies funciton
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studyToDelete, setStudyToDelete] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);



  //fetching user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);


    // this funciton handles exporitng a tsudy to the export result page
  //this allows the export page to load the correct study data by its specific ID
    const handleExport = (studyId) => { // where exactly is this cmoing from?
      navigate(`/export/${studyId}`);
    };
    const handleEdit = (studyId) => {  
        navigate(`/study/${studyId}`)
    };

    const initiateDelete = (studyId) => {
      setStudyToDelete(studyId);
      setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
      if (studyToDelete) {
        try {
          setLoading(true);
          await handleDelete(studyToDelete, setStudies, setLoading, setError, studies );
        } catch (error) {
          handleApiError(error, setError);
        } finally {
          setLoading(false);
          setIsDeleteModalOpen(false);
          setStudyToDelete(null);
        }
      }
    };
     


    // fetch studies to display in dashboard
    useEffect(() => {
        const fetchStudies = async () => {
            try {
                setLoading(true);
                const data = await getAllStudies(); // -> getting from the sevrice where it is agin requesting to backend where i defined my controller the logics
                setStudies(data);
                setError(null);
            } catch (error) {
                handleApiError(error, setError, 'Could not load studies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudies();
    }, []);

    const greeting = () => { // https://dev.to/adrianvalenz/time-based-greeting-with-react-and-bridgetown-4b42
      var myDate = new Date();
      var hours = myDate.getHours();
      var greet;

      if (hours < 12)
        greet = "Morning";
      else if (hours >= 12 && hours <=17)
        greet = "Afternoon";
      else if (hours >=17 && hours <= 24)
        greet = "Evening";

        // at first i did not returned teh value greet which got me undefined value
        // in js when fucntion defines varibales like here grett and set soemhting like in this case time
        // and does not return anything, like any value, it iwll return undefined
        return greet;
    }
    return (
        <div className={styles.container}>
          {/*this is the header/navbar with props*/}
          
          {/*main content*/}
          <main className={styles.mainContent}>
            <h1 className={styles.welcomeHeader}>
               {greeting()}, {currentUser ? currentUser.username : "user"} </h1> 
            
            {loading && <div>Loading studies...</div>}
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            {/* show content if there are no error message and loading is success*/}
            {!loading && !error && (
              <>
                {/* Empty state for projects */}
                {studies.length === 0 ? (
                  <div className={styles.emptyStateContainer}>
                    <div className={styles.emptyState}>
                      <h3>Organize all your studies with projects</h3>
                      <button className={styles.createFirstButton} onClick={() => navigate('/create-study')}>
                        Create your first project
                      </button>
                    </div>
                  </div>
                ) : (
                  /* show list studies when available -> when they are created */
                  <div className={styles.studyList}>
                    {studies.map(study => (
                      <StudyItem
                        key={study._id}
                        study={study}
                        //onRename={handleRename}
                        onEdit={handleEdit}
                        onDelete={initiateDelete}
                        onExport={handleExport}
                      />
                    ))}
                  </div>
                )}
                <ConfirmationMsg
                  isOpen={isDeleteModalOpen}
                  message="Are you sure you want to delete this study? This action cannot be undone."
                  onConfirm={confirmDelete}
                  onCancel={() => setIsDeleteModalOpen(false)}
                />
              </>
            )}
          </main>
        </div>
      );
    };
    
    

export default DashboardPage