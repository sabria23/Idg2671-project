import QuestionList from '../src/pages/studies/components/QuestionList';


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

// Edge test. 