// QuestionTypeWrapper.jsx

import React, { useState, useEffect } from 'react';
import ArtifactDisplay from './ArtifactDisplay';
import MultipleChoice from './MultipleChoice';
import Checkbox       from './Checkbox';
import OpenEnded      from './OpenEnded';
import NumericRating  from './../../studies/components/NumericRating';
import StarRating     from './../../studies/components/StarRating';
import EmojiRating    from './../../studies/components/EmojiRating';
import LabelSlider    from './../../studies/components/LabelSlider';
import ThumbsUpDown   from './../../studies/components/ThumbsUpDown';

const componentsMap = {
  'multiple-choice': MultipleChoice,
  'checkbox':        Checkbox,
  'open-ended':      OpenEnded,
  'numeric-rating':  NumericRating,
  'star-rating':     StarRating,
  'emoji-rating':    EmojiRating,
  'label-slider':    LabelSlider,
  'thumbs-up-down':  ThumbsUpDown
};

const ratingTypes = new Set([
  'numeric-rating',
  'star-rating',
  'emoji-rating',
  'label-slider',
  'thumbs-up-down'
]);

const QuestionTypeWrapper = ({
  questionType,
  question,
  defaultValue = null,
  onAnswer
}) => {
  const Component = componentsMap[questionType];
  if (!Component) return <p>Unsupported question type: {questionType}</p>;

  const isMulti = ratingTypes.has(questionType)
    && question.artifacts?.length > 1;

  // scalar vs map-of-artifactId→answer
  const [value, setValue] = useState(
    defaultValue != null ? defaultValue : (isMulti ? {} : null)
  );
  const [selectedArt, setSelectedArt] = useState(
    isMulti ? question.artifacts[0]._id : null
  );

  // reset on question change
  useEffect(() => {
    setValue(defaultValue != null ? defaultValue : (isMulti ? {} : null));
    if (isMulti) setSelectedArt(question.artifacts[0]._id);
  }, [question._id]);

  // auto-submit on change
  useEffect(() => {
    if (value !== null) onAnswer(value);
  }, [value]);

  // multi-artifact picker + single rating
  if (isMulti) {
    return (
      <>
        {/* Artifact thumbnails */}
        <div className="artifact-grid">
          {question.artifacts.map((art) => (
            <div
              key={art._id}
              className={`artifact-item${
                art._id === selectedArt ? ' selected' : ''
              }`}
              onClick={() => setSelectedArt(art._id)}
            >
              <ArtifactDisplay fileContent={[art]} />
            </div>
          ))}
        </div>

        {/* Rating for the selected artifact */}
        <div className="rating-container">
          <div className="rating-item">
            {/* show only the active artifact */}
            <ArtifactDisplay
              fileContent={question.artifacts.filter(a => a._id === selectedArt)}
            />
            <Component
              question={{ ...question, artifacts: [question.artifacts.find(a => a._id === selectedArt)] }}
              externalValue={value[selectedArt] ?? null}
              onExternalChange={(ans) =>
                setValue(v => ({ ...v, [selectedArt]: ans }))
              }
            />
          </div>
        </div>
      </>
    );
  }

  // single artifact / non-rating fallthrough
  return (
    <Component
      question={question}
      externalValue={value}
      onExternalChange={setValue}
    />
  );
};

export default QuestionTypeWrapper;
