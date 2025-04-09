import {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import styles from "../../styles/Dash.module.css";
import React from 'react';
import Navbar from "../../components/common/Navbar";
import StudyItem from "./components/StudyItem.jsx";
import { getAllStudies, deleteStudy } from "../../services/studyService.js";
import { handleApiError } from "../../utils/errorHandler.js";
import ConfirmationMsg from '../../components/common/ConfirmationMsg.jsx';
import { handleDelete } from './utils/studyActions.js';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studies, setStudies] = useState([]); // this is where list of studies fetched from backend will be stored, updated with SetStudies funciton
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studyToDelete, setStudyToDelete] = useState(null);

    const handleDelete = (studyId) => {
      setStudyToDelete(studyId);
      setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
      if (studyToDelete) {
        try {
          setLoading(true);
          await handleDelete(studyToDelete);
          setStudies(prevStudies => 
            prevStudies.filter(study => study._id !== studyToDelete)
          );
        } catch (error) {
          handleApiError(error, setError);
        } finally {
          setLoading(false);
          setIsDeleteModalOpen(false);
          setStudyToDelete(null);
        }
      }
    };

    const handleLogout = () => {
        console.log("Logging out...");
        // Add your logout logic here
      };
    
  

       // Your specific navigation items for the Dashboard
    const dashboardNavItems = [
        { label: "Create a study", path: "/create-study" },
        { label: "Profile", path: "/profile" },
        { label: "Logout", action: handleLogout }
    ];

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

    return (
        <div className={styles.container}>
          {/*this is the header/navbar with props*/}
          <Navbar
            title="StudyPlatform"
            navItems={dashboardNavItems}
            onLogout={handleLogout}
          />
          {/*main content*/}
          <main className={styles.mainContent}>
            <h1 className={styles.welcomeHeader}>hello, you</h1> {/*this will take variable to username and time */}
            
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
                        //onEdit={handleEdit}
                        onDelete={handleDelete}
                       // onExport={handleExport}
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