import React, { useState } from 'react';

//----------------------Thumbs Up/Down Rating-------------------------------
const ThumbsUpDown = () =>{
    const [thumbRating, setThumbRating] = useState(null);

    return(
        <>
            <div>
                <h2>Thumbs Up/ Down</h2>
                <div>
                    <button
                    
                        onClick={() => setThumbRating(false)}
                    >
                        🖕
                    </button>
                    <button
                    
                        onClick={() => setThumbRating(true)}
                    >
                        👌
                    </button>
                </div>
                <p>
                    {thumbRating === true && 'Liked'}
                    {thumbRating === false && 'Disliked'}
                    {thumbRating === null && 'No Rating Selected'}
                </p>
            </div>
        </>
    );
};



export default ThumbsUpDown;