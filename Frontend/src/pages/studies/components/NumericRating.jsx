import React, { useState, useEffect } from 'react';
import styles from '../styles/LabelNumericSlider.module.css';


//---------------Numeric Rating-----------------------------
const NumericRating = ({ externalValue, onExternalChange }) =>{
    const [numericRating, setNumericRating] = useState(externalValue || 0);

    useEffect(() => {
    if (onExternalChange && numericRating !== null) {
      onExternalChange(numericRating);
    }
  }, [numericRating]);

    return(
        <>
            <div className={styles['ratingContainer']}>
                <h2>Numeric Rating (0-10)</h2>
                <div>
                    <input 
                        className={styles['ratingSlider']}
                        type= 'range'
                        min='0'
                        max='10'
                        step='1'
                        value={numericRating}
                        onChange={(e) => setNumericRating(parseInt(e.target.value))}
                    />
                    <div className={styles['sliderLabels']}>
                        {[0,1,2,3,4,5,6,7,8,9,10].map((num) =>(
                            <p key={num}>{num}</p>
                        ))}
                    </div>
                    <p className={styles['numericRating']}>{numericRating}</p>
                </div>
            </div>
        </>
    );
};



export default NumericRating;