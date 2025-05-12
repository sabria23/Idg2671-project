import React, { useState, useEffect } from 'react';
import styles from '../styles/EmojiThumbs.module.css';

//----------------------Thumbs Up/Down Rating-------------------------------
const ThumbsUpDown = ({ externalValue, onExternalChange }) =>{
    const [thumbRating, setThumbRating] = useState(externalValue !== undefined ? externalValue : null); // use externalvalue if available

  useEffect(() => {
    if (onExternalChange && thumbRating !== null) {
      onExternalChange(thumbRating);
    }
  }, [thumbRating]);

    return(
        <>
            <div className={styles['ratingContainer']}>
                <h2>Thumbs Up/ Down</h2>
                <div>
                    <button
                      className={styles['emojis']}
                      onClick={() => setThumbRating(false)}
                    >
                        👎
                    </button>
                    <button
                      className={styles['emojis']}
                      onClick={() => setThumbRating(true)}
                    >
                        👍
                    </button>
                </div>
                <p className={styles['emojiRating']}>
                    {thumbRating === true && 'Liked'}
                    {thumbRating === false && 'Disliked'}
                    {thumbRating === null && 'No Rating Selected'}
                </p>
            </div>
        </>
    );
};



export default ThumbsUpDown;