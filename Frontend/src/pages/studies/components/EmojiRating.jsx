import React, { useState } from 'react';

//------------------Emoji Rating------------------------------
const EmojiRating = () =>{
    const [emojiRating, setEmojiRating] = useState();

    const emojis = ['💩', '😞', '🤷‍♂️', '😺', '💖'];

    return(
        <>
            <div>
                <h2>Emoji Rating</h2>
                <div>
                    {emojis.map((emoji, index) =>(
                        <button
                        
                            key={index}
                            onClick={() => setEmojiRating(index +1)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
                <p>
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