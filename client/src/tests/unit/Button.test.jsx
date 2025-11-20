import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/Button';

test('renders button with correct text', () => {
  render(<Button>Click Me</Button>);
  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();
});

test('calls onClick handler when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  fireEvent.click(screen.getByText(/Click Me/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('does not trigger click when disabled', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} disabled>Click Me</Button>);
  fireEvent.click(screen.getByText(/Click Me/i));
  expect(handleClick).not.toHaveBeenCalled();
});