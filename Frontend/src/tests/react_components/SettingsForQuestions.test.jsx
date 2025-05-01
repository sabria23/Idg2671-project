import SettingsForQuestions from '../../pages/studies/components/SettingsForQuestions';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { it, expect } from '@jest/globals';

// Positive test.
it('renders settings for a valid scaling question with star-rating', () =>{
    const questions =[{
        questionTitle: 'How satisfied are you with the sound on this video?',
        questionType: 'scaling',
        ratingType: 'star-rating'
    }];

    render(
        <SettingsForQuestions
            questions={questions}
            setQuestions={()=>{}}
            selectedQuestionIndex={0}
            setSelectedQuestionIndex={()=>{}}
        />
    );

    expect(screen.getByDisplayValue('How satisfied are you with the sound on this video?')).toBeInTheDocument();
    expect(screen.getAllByText('Star Rating').length).toBeGreaterThan(0);
});

// Boundary test.
it('renders nothing if selectedQuestionIndex is null or out of bounds', () =>{
const questions = [{ questionTitle: 'Sample' }];

    const { container: nullCase } = render(
        <SettingsForQuestions
            questions={questions}
            setQuestions={()=>{}}
            SelectedQuestionIndex={null}
            setSelectedQuestionIndex={()=>{}}
        />
    );
    expect(nullCase.firstChild).toBeEmptyDOMElement();

    const { container: outOfBoundsCase } = render(
        <SettingsForQuestions
            questions={questions}
            setQuestions={()=>{}}
            SelectedQuestionIndex={10}
            setSelectedQuestionIndex={()=>{}}
        />
    );
    expect(outOfBoundsCase.firstChild).toBeEmptyDOMElement();
});

// Edge test.
it('renders with a very long question title', ()=>{
    const longTitle = 'questionTitle'.repeat(100);

    const questions = [{
    questionTitle: longTitle,
    questionType: 'open-ended',
    }];

    render(
    <SettingsForQuestions
        questions={questions}
        setQuestions={() => {}}
        selectedQuestionIndex={0}
        setSelectedQuestionIndex={() => {}}
    />
    );

    expect(screen.getByDisplayValue(longTitle)).toBeInTheDocument();
});

// Negative test.
it('renders fallback rating component when ratingType is invalid', ()=>{
    const questions =[{
        questionTitle: 'Rate the image',
        questionType: 'scaling',
        ratingType: 'made-up-rating-type' //invalid rating type
    }];

    render(
        <SettingsForQuestions
            questions={questions}
            setQuestions={() => {}}
            selectedQuestionIndex={0}
            setSelectedQuestionIndex={() => {}}
        />
    );

    expect(screen.getByRole('heading', { name: /numeric rating/i })).toBeInTheDocument();
  });
  