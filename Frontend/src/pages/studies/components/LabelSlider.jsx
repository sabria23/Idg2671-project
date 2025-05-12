import React, { useState } from 'react';
import styles from '../styles/LabelNumericSlider.module.css';

//------------------------Slider with label--------------------------
const LabelSlider = ({ externalValue, onExternalChange }) =>{
    const [labelRating, setLabelRating] = useState(externalValue || 0);

    useEffect(() => {
    if (onExternalChange && labelRating !== null) {
      onExternalChange(labelRating);
    }
  }, [labelRating]);

    const getLabelSlider = (value) =>{
        if(value <20) return 'Very Dissatisfied';
        if(value <40) return 'Dissatisfied';
        if(value <60) return 'Neutral';
        if(value <80) return 'Satisfied';
        return 'Very Satisfied'
    };

    return(
        <div className={styles['ratingContainer']}>
            <h2>Slider With Labels</h2>
            <div>
                <input 
                  className={styles['ratingSlider']}
                  type='range'
                  min='0'
                  max='100'
                  step='1'
                  value={labelRating}
                  onChange={(e) => setLabelRating(parseInt(e.target.value))}
                />
                <div className={styles['sliderLabels']}>
                    <p>0 <span>Very Dissatisfied</span></p>
                    <p>50 <span>Neutral</span></p>
                    <p>100 <span>Very Satisfied</span></p>
                </div>
                <p className={styles['labelSlider-value']}>{getLabelSlider(labelRating)}</p>
            </div>

        </div>
    );
};

export default LabelSlider;