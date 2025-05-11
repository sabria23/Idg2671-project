import React, { useState } from 'react';
import styles from '../styles/EmojiThumbs.module.css';

//----------------------Thumbs Up/Down Rating-------------------------------
const ThumbsUpDown = () =>{
    const [thumbRating, setThumbRating] = useState(null);

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