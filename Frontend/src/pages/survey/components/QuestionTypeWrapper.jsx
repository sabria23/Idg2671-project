import { useState, useEffect } from 'react';
import StarRating from './../../studies/components/StarRating';
import EmojiRating from './../../studies/components/EmojiRating';
import ThumbsUpDown from './../../studies/components/ThumbsUpDown';
import NumericRating from './../../studies/components/NumericRating';
import LabelSlider from './../../studies/components/LabelSlider';
import OpenEnded from './OpenEnded';
import Checkbox from './Checkbox';
import MultipleChoice from './MultipleChoice';

// Main wrapper that dynamically renders based on questionType
const QuestionTypeWrapper = ({
  questionType,        // e.g. 'emoji-rating', 'star-rating'
  onAnswer,            // Callback to submit the selected answer
  defaultValue = null  // Optional prefilled value
}) => {
  const [value, setValue] = useState(defaultValue);

  // Notify parent survey logic whenever answer changes
  useEffect(() => {
    if (value !== null && typeof onAnswer === 'function') {
      onAnswer(value);
    }
  }, [value, onAnswer]);

  // Match questionType to actual component
  const componentsMap = {
    'multiple-choice': MultipleChoice,
    'checkbox': Checkbox,
    'open-ended': OpenEnded,
    'emoji-rating': EmojiRating,
    'star-rating': StarRating,
    'thumbs-up-down': ThumbsUpDown,
    'numeric-rating': NumericRating,
    'label-slider': LabelSlider
  };

  const Component = componentsMap[questionType];

  if (!Component) return <p>Unsupported question type: {questionType}</p>;

  return (
    <Component
      externalValue={value}
      onExternalChange={setValue}
    />
  );
};

export default QuestionTypeWrapper;
