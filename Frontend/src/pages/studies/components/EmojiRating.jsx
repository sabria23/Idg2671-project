import React, { useState } from 'react';
import styles from '../styles/EmojiThumbs.module.css';


//------------------Emoji Rating------------------------------
const EmojiRating = () =>{
    const [emojiRating, setEmojiRating] = useState();

    const emojis = ['😠', '🙁', '😐', '🙂', '😄'];

    return(
        <>
            <div className={styles['ratingContainer']}>
                <h2>Emoji Rating</h2>
                <div>
                    {emojis.map((emoji, index) =>(
                        <button
                          className={styles['emojis']}
                          key={index}
                          onClick={() => setEmojiRating(index +1)}
                        >
                          {emoji}
                        </button>
                    ))}
                </div>
                <p className={styles['emojiRating']}>
                    {emojiRating === 1 && 'Very Dissatisfied'}
                    {emojiRating === 2 && 'Dissatisfied'}
                    {emojiRating === 3 && 'Neutral'}
                    {emojiRating === 4 && 'Satisfied'}
                    {emojiRating === 5 && 'Very Satisfied'}
                </p>
            </div>
        </>
    );
};

export default EmojiRating;