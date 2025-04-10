import React, { useState } from 'react';

//----------------------Thumbs Up/Down Rating-------------------------------
const ThumbsUpDown = () =>{
    const [thumbRating, setThumbRating] = useState(null);

    return(
        <>
            <div className={}>
                <h2 className={}>Thumbs Up/ Down</h2>
                <div className={}>
                    <button
                        className={}
                        onClick={() => setThumbRating(false)}
                    >
                        🖕
                    </button>
                    <button
                        className={}
                        onClick={() => setThumbRating(true)}
                    >
                        👌
                    </button>
                </div>
                <p className={}>
                    {thumbRating === true && 'Liked'}
                    {thumbRating === false && 'Disliked'}
                    {thumbRating === null && 'No Rating Selected'}
                </p>
            </div>
        </>
    );
};



export default ThumbsUpDown;