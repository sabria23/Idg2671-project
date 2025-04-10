import React, { useState } from 'react';

//---------------Numeric Rating-----------------------------
const NumericRating = () =>{
    const [numericRating, setNumericRating] = useState();

    return(
        <>
            <div>
                <h2>Numeric Rating (1-10)</h2>
                <div>
                    <input 
                    
                        type= 'range'
                        min='1'
                        max='10'
                        step='1'
                        value={numericRating}
                        onChange={(e) => setNumericRating(parseInt(e.target.value))}
                    />
                    <div>
                        {[1,2,3,4,5,6,7,8,9,10].map((num) =>(
                            <span key={num}>{num}</span>
                        ))}
                    </div>
                    <p>{numericRating}</p>
                </div>
            </div>
        </>
    );
};



export default NumericRating;