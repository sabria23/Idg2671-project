import React, { useState } from 'react';

//------------------------Slider with label--------------------------
const LabelSlider = () =>{
    const [labelRating, setLabelRating] = useState();

    const getLabelSlider = (value) =>{
        if(value <20) return 'Very Dissatisfied';
        if(value <40) return 'Dissatisfied';
        if(value <60) return 'Neutral';
        if(value <80) return 'Satisfied';
        return 'Very Satisfied'
    };

    return(
        <div>
            <h2>Slider With Labels</h2>
            <div>
                <input 
                    type='range'
                    min='0'
                    max='100'
                    value={labelRating}
                    onChange={(e) => setLabelRating(parseInt(e.target.value))}
                />
                <div>
                    <span>Very Dissatisfied</span>
                    <span>Neutral</span>
                    <span>Very Satisfied</span>
                </div>
                <p>{getLabelSlider(labelRating)}</p>
            </div>

        </div>
    );
};

export default LabelSlider;