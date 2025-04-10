import React, { useState } from 'react';
import { VscStarEmpty } from 'react-icons/vsc';
import { VscStarFull } from 'react-icons/vsc';
//---------------Numeric Rating-----------------------------
const NumericRating = () =>{
    const [numericRating, setNumericRating] = useState();

    return(
        <>
            <div className={}>
                <h2>Numeric Rating (1-10)</h2>
                <div>
                    <input 
                        className={}
                        type= 'range'
                        min='1'
                        max='10'
                        step='1'
                        value={numericRating}
                        onChange={(e) => setNumericRating(parseInt(e.target.value))}
                    />
                    <div className={}>
                        {[1,2,3,4,5,6,7,8,9,10].map((num) =>(
                            <span key={num}>{num}</span>
                        ))}
                    </div>
                    <p className={}>{numericRating}</p>
                </div>
            </div>
        </>
    );
};

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
        <div className={}>
            <h2 className={}>Slider With Labels</h2>
            <div className={}>
                <input 
                    className={}
                    type='range'
                    min='0'
                    max='100'
                    value={labelRating}
                    onChange={(e) => setLabelRating(parseInt(e.target.value))}
                />
                <div className={}>
                    <span>Very Dissatisfied</span>
                    <span>Neutral</span>
                    <span>Very Satisfied</span>
                </div>
                <p className={}>{getLabelSlider(labelRating)}</p>
            </div>

        </div>
    );
};

export default NumericRating;
export default StarRating;
export default EmojiRating;
export default ThumbsUpDown;
export default LabelSlider;