/* THINGS I NEED TO DO TODAY
1. Toggle a study from draft to published = DONE
2. have it made so that when researtcher unpiblished the link then it is not accessible anymore to pariticpants, the link need to be connected to marius study and that specifci studyid = DONE
3. Generate a shareable link for a published study = DONE
5. Invite participants via email = DONE
9. copy needs tilabek melding = DONE
6. add demograpfics field and whatever fields you want to have, these will be displayed as part of the survey once participant takes the link = ALMOST DONE
4. make the link secure so it cannot be shared by other people and that you can only take it one time
7. expiration time 1 hour, ask about this. 
8. only take it once
*/

import React, {useState, useEffect} from 'react';
import studyService from '../../services/studyService';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/Recruitment.module.css';

//components of recruitmens page
import TogglePublish from './components/TogglePublish';
import ShareableLink from './components/ShareableLink';
import EmailInvitation from './components/Email.Invitation';
import DemographSettings from './components/DemographSettings';

const RecruitmentPage = () => {
  // 1. Get studyId from URL parameters
  const { studyId } = useParams();
  
  // 2. State to store study data
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. Fetch study data on component mount
  useEffect(() => {
    const fetchStudy = async () => {
      try {
        setLoading(true);
        // Call your backend API to get study details
        const studyData = await studyService.getStudyById(studyId);
        setStudy(studyData);
        setError(null);
      } catch (err) {
        console.error("Error fetching study:", err);
        setError("Failed to load study details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudy();
  }, [studyId]); // Re-fetch if studyId changes

  // 4. Handler for toggling published status
  const handlePublishToggle = async (newPublishedStatus) => {
    try {
      // Call backend to update status
      await studyService.updateStudyStatus(studyId, newPublishedStatus);
      
      // for teh error handling it is the try/catch, and this line of code only works/runs if the API call is successfull
      setStudy(prevStudy => ({
        ...prevStudy,
        published: newPublishedStatus
      }));
      // The catch Block: Executes if any error occurs in the try block
    } catch (err) {
      console.error("Error updating study status:", err);
      // Handle error (show notification, etc.) -> need to do proper UI for user error handling as well
    }
  };

  // 5. Loading state
  if (loading) {
    return <div className={styles.loadingContainer}>Loading study...</div>;
  }

  // 6. Error state
  if (error || !study) {
    return <div className={styles.errorContainer}>{error || "Study not found"}</div>;
  }

  // 7. Render components with props
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/*props title, createdDate, published, onToggle that will be decontstruted in togglePublish.jsx */}
        <TogglePublish 
          title={study.title}
          createdDate={study.createdAt}
          published={study.published}
          onToggle={handlePublishToggle}
        />
         {/* need to have this conditonal rendering to see if study is and if ti also is pbulsihed because then it will apear*/ }
        {study && study.published && (
          <ShareableLink 
            studyId={studyId} 
            published={study.published}
          />
        )}
        
        {study.published && <EmailInvitation studyId={study._id} />}
        
        <DemographSettings
          studyId={studyId}
          isPublished={studyId.published}
        />
      </div>
    </div>
  );
};
export default RecruitmentPage;