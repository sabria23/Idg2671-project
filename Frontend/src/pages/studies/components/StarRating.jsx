import React, { useState } from 'react';
import { VscStarEmpty } from 'react-icons/vsc';
import { VscStarFull } from 'react-icons/vsc';


//----------------------Star Rating-------------------------
const StarRating = () =>{
    const [starRating, setStarRating] = useState();
    const [hoverStar, setHoverStar] = useState(null);

    return(
        <>
            <div className={}>
                <h2>Star Rating</h2>
                <div className={}>
                    {[1,2,3,4,5].map((star) =>(
                        <button
                            className={}
                            key={star}
                            onClick={() => setStarRating(star)}
                            onMouseEnter={() => setHoverStar(star)}
                            onMouseLeave={() => setHoverStar(null)}
                        >
                            {star <= (hoverStar || starRating) ? <VscStarEmpty /> : <VscStarFull />}
                        </button>
                    ))}
                </div>
                <p className={}>{starRating} of 5 stars</p>
            </div>
        </>
    );   
};


export default StarRating;