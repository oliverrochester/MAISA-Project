import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberWords from './numberWords';
import { sortText } from '../apiUtils/sortText';

jest.mock('../apiUtils/sortText', () => ({
  sortText: jest.fn(),
}));

describe('NumberWords (real validateCommaSeparatedNumbers)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows error when Sort is clicked with empty input', async () => {
    render(<NumberWords />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    expect(sortText).not.toHaveBeenCalled();
    expect(
      screen.getByText('Enter at least one number (e.g. 1, 2, 15, -42).'),
    ).toBeInTheDocument();
  });

  it('shows empty error for whitespace-only input', async () => {
    render(<NumberWords />);
    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    await user.type(input, '\n  \n');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    expect(sortText).not.toHaveBeenCalled();
    expect(
      screen.getByText('Enter at least one number (e.g. 1, 2, 15, -42).'),
    ).toBeInTheDocument();
  });

  it('shows error for consecutive commas (empty segment)', async () => {
    render(<NumberWords />);
    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    await user.type(input, '1,,3');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    expect(sortText).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        'Empty number detected. Please ensure all numbers are valid whole numbers (e.g. 1, 2, 15, -42).',
      ),
    ).toBeInTheDocument();
  });

  it('shows error for decimal token', async () => {
    render(<NumberWords />);
    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    await user.type(input, '1.5');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    expect(sortText).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        'Invalid whole number: "1.5". Use whole numbers only (e.g. 1, 2, 15, -42).',
      ),
    ).toBeInTheDocument();
  });

  it('shows error for non-numeric token', async () => {
    render(<NumberWords />);
    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    await user.type(input, '10e4');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    expect(sortText).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        'Invalid whole number: "10e4". Use whole numbers only (e.g. 1, 2, 15, -42).',
      ),
    ).toBeInTheDocument();
  });

  it('shows error for integer outside safe range', async () => {
    const outOfRange = String(Number.MAX_SAFE_INTEGER + 1);
    render(<NumberWords />);
    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    await user.type(input, outOfRange);
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    expect(sortText).not.toHaveBeenCalled();
    expect(
      screen.getByText(`Number too large: "${outOfRange}". Use whole numbers only (e.g. 1, 2, 15, -42).`),
    ).toBeInTheDocument();
  });

  it('calls sortText with numeric parts and renders output for valid input', async () => {
    sortText.mockResolvedValue({
      data: [
        { type: 'text', number: 1, value: 'one' },
        { type: 'text', number: 2, value: 'two' },
      ],
    });

    render(<NumberWords />);
    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    await user.type(input, '1,2');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    await waitFor(() => {
      expect(sortText).toHaveBeenCalledWith([1, 2]);
    });

    expect(screen.getByTestId('output-container')).toBeInTheDocument();
    expect(screen.getByTestId('output-text-item-0')).toHaveTextContent('one');
    expect(screen.getByTestId('output-text-item-1')).toHaveTextContent('two');
  });

  it('calls sortText with numeric parts and renders output for valid input', async () => {
    sortText.mockResolvedValue({
      data: [
        { type: 'text', number: 1, value: 'one' },
        { type: 'text', number: 3, value: 'three' },
        { type: 'text', number: 2, value: 'two' },
        
      ],
    });

    render(<NumberWords />);
    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    await user.type(input, '1,2,3');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    await waitFor(() => {
      expect(sortText).toHaveBeenCalledWith([1, 2, 3]);
    });

    expect(screen.getByTestId('output-container')).toBeInTheDocument();
    expect(screen.getByTestId('output-text-item-0')).toHaveTextContent('one');
    expect(screen.getByTestId('output-text-item-1')).toHaveTextContent('three');
    expect(screen.getByTestId('output-text-item-2')).toHaveTextContent('two');
  });
});
