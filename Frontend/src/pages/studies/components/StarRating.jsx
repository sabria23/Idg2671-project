import React, { useState } from 'react';
import { VscStarEmpty } from 'react-icons/vsc';
import { VscStarFull } from 'react-icons/vsc';
import styles from '../styles/StarRating.module.css';

//----------------------Star Rating-------------------------
const StarRating = () =>{
    const [starRating, setStarRating] = useState();
    const [hoverStar, setHoverStar] = useState(null);

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