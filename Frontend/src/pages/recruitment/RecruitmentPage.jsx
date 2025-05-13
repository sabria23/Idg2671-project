/* THINGS I NEED TO DO TODAY
Toggle a study from draft to published
Generate a shareable link for a published study -> the link need to be connected to marius study and that specifci studyid
Invite participants via email
add demograpfics field 
have it made so that when researtcher unpiblished the link then it is not accessible anymore to pariticpants 
make the link secure so it cannot be shared by other people and that you can only take it one time*/

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
      
      // Update local state
      setStudy(prevStudy => ({
        ...prevStudy,
        published: newPublishedStatus
      }));
    } catch (err) {
      console.error("Error updating study status:", err);
      // Handle error (show notification, etc.)
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
        
        {studyId.published && (
          <ShareableLink 
            studyId={studyId} 
          />
        )}
        
        <EmailInvitation 
          studyId={studyId}
          //onSendInvitations={handleSendInvitations}
        />
        
        <DemographSettings
          studyId={studyId}
          isPublished={studyId.published}
          //onSave={handleSaveDemographics}
        />
      </div>
    </div>
  );
};
export default RecruitmentPage;