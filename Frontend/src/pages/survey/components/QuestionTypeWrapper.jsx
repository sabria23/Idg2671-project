import React, { useState, useEffect } from 'react';
import StarRating from '../../studies/components/StarRating';
import EmojiRating from '../../studies/components/EmojiRating';
import ThumbsUpDown from '../../studies/components/ThumbsUpDown';
import NumericRating from '../../studies/components/NumericRating';
import LabelSlider from '../../studies/components/LabelSlider';
import OpenEnded from './OpenEnded';
import Checkbox from './Checkbox';
import MultipleChoice from './MultipleChoice';
import ArtifactDisplay from './ArtifactDisplay';

// Map question types to their UI components
const componentsMap = {
  'multiple-choice': MultipleChoice,
  'checkbox':        Checkbox,
  'open-ended':      OpenEnded,
  'emoji-rating':    EmojiRating,
  'star-rating':     StarRating,
  'thumbs-up-down':  ThumbsUpDown,
  'numeric-rating':  NumericRating,
  'label-slider':    LabelSlider
};

// Types that get one control per artifact
const multiRatingTypes = new Set([
  'numeric-rating',
  'star-rating',
  'emoji-rating',
  'label-slider',
  'thumbs-up-down'
]);

export default function QuestionTypeWrapper({
  questionType,
  question,
  defaultValue = null,
  onAnswer
}) {
  const Component = componentsMap[questionType];
  if (!Component) {
    return <p>Unsupported question type: {questionType}</p>;
  }

  // Now use question.artifacts (what getSurvey returns)
  const artifacts = Array.isArray(question.artifacts)
    ? question.artifacts.map((a, idx) => ({
        fileId:   a.fileId,
        fileUrl:  a.fileUrl,
        fileType: a.fileType,
        label:    `Artifact ${idx + 1}`    // ← human-readable label
      }))
    : [];

  const isMulti = multiRatingTypes.has(questionType) && artifacts.length > 1;

  // Local answer state
  const [value, setValue] = useState(
    defaultValue != null
      ? defaultValue
      : isMulti
        ? {}
        : null
  );

  // If the question or defaultValue changes, reset
  useEffect(() => {
    setValue(defaultValue != null ? defaultValue : isMulti ? {} : null);
    if (isMulti && artifacts.length) {
      setSelectedArt(artifacts[0].fileId);
    }
  }, [question._id, defaultValue]);

  // Whenever our local value updates, push it upstream
  useEffect(() => {
    const meaningful =
      value !== null &&
      (typeof value !== 'object' || Object.keys(value).length > 0);
    if (meaningful) onAnswer(value);
  }, [value, onAnswer]);

  // Multi-artifact: grid of thumbs + one big preview + rating control
  const [selectedArt, setSelectedArt] = useState(
    isMulti && artifacts.length ? artifacts[0].fileId : undefined
  );

  if (isMulti) {
    return (
      <>
        {/* 1) Thumbnail strip */}
        <div className="artifact-grid">
          {artifacts.map(art => (
            <div
              key={art.fileId}   // ← unique key
              className={`artifact-item${art.fileId === selectedArt ? ' selected' : ''}`}
              onClick={() => setSelectedArt(art.fileId)}
            >
              <div className="artifact-label">{art.label}</div>
              <ArtifactDisplay fileContent={[art]} />
            </div>
          ))}
        </div>

        {/* 2) Big preview + control */}
        <div className="rating-container">
          {selectedArt && (
            <div className="rating-item" key={`rating-${selectedArt}`}>
              <div className="artifact-label">
                {artifacts.find(a => a.fileId === selectedArt)?.label}
              </div>
              <ArtifactDisplay
                fileContent={artifacts.filter(a => a.fileId === selectedArt)}
              />
              <Component
                question={{
                  ...question,
                  fileContent: artifacts.filter(a => a.fileId === selectedArt)
                }}
                externalValue={value[selectedArt] ?? null}
                onExternalChange={ans =>
                  setValue(v => ({ ...v, [selectedArt]: ans }))
                }
              />
            </div>
          )}
        </div>
      </>
    );
  }

  // Single-artifact or non-rating fallback:
  return (
    <>
      {artifacts.length > 0 && (
        <ArtifactDisplay fileContent={artifacts} />
      )}
      <Component
        question={question}
        externalValue={value}
        onExternalChange={setValue}
      />
    </>
  );
}