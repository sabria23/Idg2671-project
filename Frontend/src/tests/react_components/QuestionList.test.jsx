import React from 'react';
import QuestionList from '../../pages/studies/components/QuestionList';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest, it, expect } from '@jest/globals';

// Positive test. Test if the component renders a list of questions and allows to select one
it('renders a list of questions and allows to select one', () =>{
    const mockSetSelectedQuestionIndex = jest.fn();
    const mockAddQuestion = jest.fn();
    const questions =[
        { questionTitle: 'Rate this image' },
        { questionTitle: 'Which one of these has the best color?' },
        { questionTitle: 'Scale this image from 1 to 5 stars!' }
    ];

    render(
    <QuestionList
        questions={questions}
        selectedQuestionIndex={1}
        setSelectedQuestionIndex={mockSetSelectedQuestionIndex}
        addQuestion={mockAddQuestion}
    />
    );

    expect(screen.getByText('Rate this image')).toBeInTheDocument();
    expect(screen.getByText('Which one of these has the best color?')).toBeInTheDocument();
    expect(screen.getByText('Scale this image from 1 to 5 stars!')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Which one of these has the best color?'));
    expect(mockSetSelectedQuestionIndex).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('+ Add Question'));
    expect(mockAddQuestion).toHaveBeenCalled();
});

// Edge test. Test if the component renders correctly if there is no questions
it('renders correctly when there are no questions', ()=>{
    render(
        <QuestionList
            questions={[]}
            selectedQuestionIndex={null}
            setSelectedQuestionIndex={() => {}}
            addQuestion={()=> {}}
        />
    );

    expect(screen.getByText('+ Add Question')).toBeInTheDocument();
});

// Negative test 1. A test for missing questionTitle
it('renders fallback label if questionTitle is missing', ()=>{
    const questions = [{}]; // The missing title
    render(
        <QuestionList
            questions={questions}
            selectedQuestionIndex={0}
            setSelectedQuestionIndex={() => {}}
            addQuestion={()=> {}}
        />
    );

    expect(screen.getByText('Question 1')).toBeInTheDocument();
});

// Negative test 2. 
it('handles invalid questions prop gracefully (e.g., null)', ()=>{
    render(
        <QuestionList
            questions={null}
            selectedQuestionIndex={0}
            setSelectedQuestionIndex={()=>{}}
            addQuestion={()=>{}}
        />
    );

    expect(screen.getByText('+ Add Question')).toBeInTheDocument();
});