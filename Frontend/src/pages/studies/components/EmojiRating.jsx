import React, { useState } from 'react';

//------------------Emoji Rating------------------------------
const EmojiRating = () =>{
    const [emojiRating, setEmojiRating] = useState();

    const emojis = ['💩', '😞', '🤷‍♂️', '😺', '💖'];

    return(
        <>
            <div className={}>
                <h2 className={}>Emoji Rating</h2>
                <div className={}>
                    {emojis.map((emoji, index) =>(
                        <button
                            className={}
                            key={index}
                            onClick={() => setEmojiRating(index +1)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
                <p className={}>
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