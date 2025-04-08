import {useState, useEffect} from 'react';
import styles from "../../styles/Dash.module.css";
import React from 'react';
import Navbar from "../../components/common/Navbar";
import StudyItem from "./components/StudyItem.jsx";
import { getAllStudies } from "../../services/studyService.js";
import { handleApiError } from "../../utils/errorHandler.js";

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studies, setStudies] = useState([]);


    const handleLogout = () => {
        console.log("Logging out...");
        // Add your logout logic here
      };
    // Add these new methods
    // NNED TO MOVE THIS SOMEWHERE ELSE SINCE IT IS MORE RELATED TO SUDYITEM
    const handleRename = (studyId, newName) => {
        // Implement rename logic
        console.log(`Renaming study ${studyId} to ${newName}`);
        // You might want to call an update service method here
    };

    const handleEdit = (studyId) => {
        // Implement edit logic
        console.log(`Editing study ${studyId}`);
        // You might want to navigate to an edit page
    };

    const handleDelete = (studyId) => {
        // Implement delete logic
        console.log(`Deleting study ${studyId}`);
        // You might want to call a delete service method
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
                        onRename={handleRename}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      );
    };
    
    

export default DashboardPage