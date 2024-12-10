import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '..';
const buttonText = 'ButtonTest';
test('button classlist when hovered.', () => {
  const component = (
    <Button variant="outlined" size="medium" color="primary">
      {buttonText}
    </Button>
  );
  render(component);
  const buttonElement = screen.getByText(buttonText);
  userEvent.hover(buttonElement);
  fireEvent.focus(buttonElement);
  const classList = buttonElement.className;
  expect(classList).toContain<string>('hover:bg-light');
});

test('button classlist when disabled.', () => {
  const component = (
    <Button variant="outlined" size="medium" color="primary" disabled={true}>
      {buttonText}
    </Button>
  );
  render(component);
  const buttonElement = screen.getByText(buttonText);
  userEvent.hover(buttonElement);
  fireEvent.focus(buttonElement);
  const classList = buttonElement.className;
  expect(classList).toContain<string>('cursor-not-allowed');
  expect(classList).toContain<string>('opacity-70');
});

test('button click event.', () => {
  const mockOnClickFn = jest.fn();
  const component = (
    <Button
      variant="outlined"
      size="medium"
      color="primary"
      onClick={mockOnClickFn}
    >
      {buttonText}
    </Button>
  );
  render(component);
  const buttonElement = screen.getByText(buttonText);
  fireEvent.click(buttonElement);
  expect(mockOnClickFn).toHaveBeenCalledTimes(1);
});
