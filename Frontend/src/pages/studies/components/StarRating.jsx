import React, { useState, useEffect } from 'react';
import { VscStarEmpty } from 'react-icons/vsc';
import { VscStarFull } from 'react-icons/vsc';
import styles from '../styles/StarRating.module.css';

//----------------------Star Rating-------------------------
const StarRating = ({ externalValue, onExternalChange }) =>{ // Props added for the survey sections 
    const [starRating, setStarRating] = useState(externalValue || null);
    const [hoverStar, setHoverStar] = useState(null);

  // Used to notify the survey of changes
  useEffect(() => {
    if (onExternalChange && starRating !== null) {
      onExternalChange(starRating);
    }
  }, [starRating]);

    return(
      <>
        <div className={styles['ratingContainer']}>
            <h2>Star Rating</h2>
            <div>
                {[1,2,3,4,5].map((star) =>(
                    <button
                      className={styles['starEmoji']}
                        key={star}
                        onClick={() => setStarRating(star)}
                        onMouseEnter={() => setHoverStar(star)}
                        onMouseLeave={() => setHoverStar(null)}
                    >
                        {star <= (hoverStar || starRating) ? <VscStarFull /> : <VscStarEmpty />}
                    </button>
                ))}
            </div>
            <p>{starRating} of 5 stars</p>
        </div>
      </>
    );   
};


export default StarRating;