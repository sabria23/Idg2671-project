import React, { useState, useEffect } from 'react';
import ArtifactDisplay from './ArtifactDisplay';
import MultipleChoice from './MultipleChoice';
import Checkbox from './Checkbox';
import OpenEnded from './OpenEnded';
import NumericRating from './../../studies/components/NumericRating';
import StarRating from './../../studies/components/StarRating';
import EmojiRating from './../../studies/components/EmojiRating';
import LabelSlider from './../../studies/components/LabelSlider';
import ThumbsUpDown from './../../studies/components/ThumbsUpDown';

// Map of questionType to component
const componentsMap = {
  'multiple-choice': MultipleChoice,
  checkbox: Checkbox,
  'open-ended': OpenEnded,
  'numeric-rating': NumericRating,
  'star-rating': StarRating,
  'emoji-rating': EmojiRating,
  'label-slider': LabelSlider,
  'thumbs-up-down': ThumbsUpDown
};

// Question types that should be split across artifacts
const ratingTypes = new Set([
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
  onAnswer          // callback(value) to submit
}) {
  const Component = componentsMap[questionType];
  if (!Component) return <p>Unsupported question type: {questionType}</p>;

  // Safely extract non-null artifacts
  const artifacts = Array.isArray(question.artifacts)
    ? question.artifacts.filter((a) => a != null)
    : [];
  const isMulti = ratingTypes.has(questionType) && artifacts.length > 1;

  // Initialize value: use defaultValue or map for multi, scalar for single
  const [value, setValue] = useState(
    defaultValue != null
      ? defaultValue
      : isMulti
      ? {}
      : null
  );

  // Compute artifact IDs list
  const artifactIds = artifacts
    .map((a) => a._id && a._id.toString())
    .filter((id) => id);

  // Track which artifact is currently selected
  const [selectedArt, setSelectedArt] = useState(
    isMulti && artifactIds.length > 0
      ? artifactIds[0]
      : undefined
  );

  // Reset when question ID or defaultValue changes
  useEffect(() => {
    setValue(
      defaultValue != null
        ? defaultValue
        : isMulti
        ? {}
        : null
    );
    if (isMulti && artifactIds.length > 0) {
      setSelectedArt(artifactIds[0]);
    }
  }, [question._id, defaultValue]);

  // Auto-submit on change
  useEffect(() => {
    if (value !== null) onAnswer(value);
  }, [value]);

  // Multi-artifact UI: thumbnails and single rating control
  if (isMulti) {
    return (
      <>
        <div className="artifact-grid">
          {artifacts.map((art) => {
            const id = art._id && art._id.toString();
            return (
              <div
                key={id}
                className={`artifact-item${id === selectedArt ? ' selected' : ''}`}
                onClick={() => id && setSelectedArt(id)}
              >
                <ArtifactDisplay fileContent={[art]} />
              </div>
            );
          })}
        </div>
        <div className="rating-container">
          {selectedArt && (
            <div className="rating-item">
              <ArtifactDisplay
                fileContent={artifacts.filter(
                  (a) => a._id && a._id.toString() === selectedArt
                )}
              />
              <Component
                question={{
                  ...question,
                  artifacts: artifacts.filter(
                    (a) => a._id && a._id.toString() === selectedArt
                  )
                }}
                externalValue={value[selectedArt] ?? null}
                onExternalChange={(ans) =>
                  setValue((v) => ({ ...v, [selectedArt]: ans }))
                }
              />
            </div>
          )}
        </div>
      </>
    );
  }

  // Single-element fallback
  return (
    <Component
      question={question}
      externalValue={value}
      onExternalChange={setValue}
    />
  );
}
