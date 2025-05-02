import { render, screen } from '@testing-library/react';
import SurveyThanks from '../../pages/survey/components/SurveyThanks';

test('renders thank you header', () => {
  render(<SurveyThankYou />);
  expect(screen.getByRole('heading', { name: /thank you/i })).toBeInTheDocument();
});

test('renders thank you text', () => {
  render(<SurveyThankYou />);
  expect(screen.getByText(/participation/i)).toBeInTheDocument();
});

test('renders return button', () => {
  render(<SurveyThankYou />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('button has correct label', () => {
  render(<SurveyThankYou />);
  expect(screen.getByRole('button').textContent).toMatch(/return to dashboard/i);
});