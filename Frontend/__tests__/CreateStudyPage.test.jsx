// Installed React Testing Library and Jest-dom with MSW for the 
// mocking API request 

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateStudyPage from '../src/pages/studies/CreateStudyPage.jsx';
import { MemoryRouter } from 'react-router-dom';
import { server } from './mocks/server.js';
import { rest } from 'msw';


// Positive Test Case: Valid usage
test('successfully creates a study with valid inputs', async ()=>{
    render(
        <MemoryRouter>
            <CreateStudyPage />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Short descriptive title/i),{
        target: { value: 'Usability Study for Dashboard' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Brief summary of the study/i),{

        target: { value: 'Evaluating ease of navigation and aesthetics'},
    });
    fireEvent.click(screen.getByText(/Save Study/i));

    await waitFor(() =>
        expect(screen.getByText(/Preview Study/i)).toBeInTheDocument()
    );
});

// A Boundary Test Case: Just enough info to save the study (e.g. one minimal question)
test('created a study with minimal required data', async ()=>{
    render(
        <MemoryRouter>
            <CreateStudyPage />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Short descriptive title/i),{
        target: { value: 'Boundary Study'},
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Brief summary of the study/i),{
        target: { value: 'A' },
    });
    fireEvent.click(screen.getByText(/Save Study/i));

    await waitFor(()=>
        expect(screen.getByText(/Preview Study/i)).toBeInTheDocument()
    );
});

// An Edge Case: Very Long Title and Description
test('handlers extremely long input data gracefully', async() =>{
    const longTitle = 'A Title'.repeat(500);
    const longDescription = 'A Description'.repeat(1000);

    render(
        <MemoryRouter>
          <CreateStudyPage />
        </MemoryRouter>
    );

    fireEvent.change(screen.getAllByPlaceholderText(/Short descriptive title/i),{
        target: { value: longTitle },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Brief summary of the study/i),{
        target: { value: longDescription },
    });
    fireEvent.click(screen.getByText(/Save Study/i));

    await waitFor(() =>
        expect(screen.getByText(/Preview Study/i)).toBeInTheDocument()
    );
});

// A Negative Case: Simulates API failure
test('shows error message when API fails', async() =>{
    server.use(
        rest.post('/api/studies', (req, res, ctx) =>{
            return res(ctx.status(500));
        })
    );

    render(
        <MemoryRouter>
          <CreateStudyPage />
        </MemoryRouter>
    );

    fireEvent.change(screen.getAllByPlaceholderText(/Short description title/i),{
        target: { value: 'Error Study' },
    });
    fireEvent.change(screen.findAllByPlaceholderText(/Brief summary of the study/i),{
        target: { value: 'This should fail!' },
    });
    fireEvent.click(screen.getByText(/Save Study/i));

    await waitFor(()=>
    expect(screen.getByText(/Error creating study/i)).toBeInTheDocument()
    );
});