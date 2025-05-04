import React from 'react';
import ConfirmationMsg from '../../components/common/ConfirmationMsg';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest, it, expect } from '@jest/globals';

// Positive test. Render and triggers confirm and cancel actions
it('renders and triggers confirm and cancel actions', () =>{
    const mockConfirm = jest.fn();
    const mockCancel = jest.fn();

    render(
        <ConfirmationMsg
            isOpen={true}
            message='Are you sure?'
            onConfirm={mockConfirm}
            onCancel={mockCancel}
        />
    );

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockCancel).toHaveBeenCalled();
});

// Negative test 1. Checks if the component does not render anything if the isOpen is false.
it('does not render anything when isOpen is false', ()=>{
    render(
        <ConfirmationMsg
            isOpen={false}
            message='Hidden message'
            onConfirm={() =>{}}
            onCancel={() =>{}}
        />
    );

    expect(screen.queryByText('Hidden message')).not.toBeInTheDocument();
});

// Negative test 2. Checks if the component renders safely even if the message is undefined.
it('renders safely even if message is undefined', ()=>{
    render(
        <ConfirmationMsg
            isOpen={true}
            message={undefined}
            onConfirm={() =>{}}
            onCancel={() =>{}}
        />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
});


