import { render, screen } from '@testing-library/react';
import SurveyThanks from '../../pages/survey/components/SurveyThanks';

test('renders thank you header', () => {
  render(<SurveyThanks />);
  expect(screen.getByRole('heading', { name: /thank you/i })).toBeInTheDocument();
});

test('renders thank you text', () => {
  render(<SurveyThanks />);
  expect(screen.getByText(/participation/i)).toBeInTheDocument();
});

test('renders return button', () => {
  render(<SurveyThanks />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('button has correct label', () => {
  render(<SurveyThanks />);
  expect(screen.getByRole('button').textContent).toMatch(/return to dashboard/i);
});