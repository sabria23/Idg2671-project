import SettingsForQuestions from '../../pages/studies/components/SettingsForQuestions';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest, it, expect } from '@jest/globals';

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
    expect(screen.getByText('Star Rating')).toBeInTheDocument();
});

// Boundary test.
it('renders nothing if selectedQuestionIndex is null or out of bounds', () =>{
    const
})

// Edge test.

// Negative test.