/* THINGS I NEED TO DO TODAY
1. Toggle a study from draft to published = DONE
2. have it made so that when researtcher unpiblished the link then it is not accessible anymore to pariticpants, the link need to be connected to marius study and that specifci studyid = DONE
3. Generate a shareable link for a published study = DONE
5. Invite participants via email = DONE
9. copy needs tilabek melding = DONE
6. add demograpfics field and whatever fields you want to have, these will be displayed as part of the survey once participant takes the link =  DONE
9. I found out it is because I need ot  click on save demogrpahcis settings again
*/

import React, {useState, useEffect} from 'react';
import studyService from '../../services/studyService';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/Recruitment.module.css';

import TogglePublish from './components/TogglePublish';
import ShareableLink from './components/ShareableLink';
import EmailInvitation from './components/Email.Invitation';
import DemographSettings from './components/DemographSettings';

const RecruitmentPage = () => {
  const { studyId } = useParams();
  
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStudy = async () => {
      try {
        setLoading(true);
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
  }, [studyId]); 

  const handlePublishToggle = async (newPublishedStatus) => {
    try {
      await studyService.updateStudyStatus(studyId, newPublishedStatus);
      setStudy(prevStudy => ({
        ...prevStudy,
        published: newPublishedStatus
      }));
    } catch (err) {
      console.error("Error updating study status:", err);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading study...</div>;
  }

  if (error || !study) {
    return <div className={styles.errorContainer}>{error || "Study not found"}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <TogglePublish 
          title={study.title}
          createdDate={study.createdAt}
          published={study.published}
          onToggle={handlePublishToggle}
        />
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