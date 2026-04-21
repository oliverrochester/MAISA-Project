import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberWords from './numberWords';
import { sortText } from '../apiUtils/sortText';
import validateCommaSeparatedNumbers from '../lib/validateCommaSeparatedNumbers';

jest.mock('../apiUtils/sortText', () => ({
  sortText: jest.fn(),
}));

jest.mock('../lib/validateCommaSeparatedNumbers', () => jest.fn());

describe('NumberWords', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders screen and components with initial empty state', () => {
    render(<NumberWords />);

    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    const button = screen.getByRole('button', { name: 'Sort Text' });

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(button).toBeInTheDocument();
    expect(screen.queryByTestId('output-container')).not.toBeInTheDocument();
  });

  it('Shows "Invalid whole number" validation error and does not call sortText when input is invalid', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: false,
      error: 'Invalid whole number: "10e2". Use whole numbers only (e.g. 1, 2, 15, -42).',
    });

    render(<NumberWords />);

    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    const button = screen.getByRole('button', { name: 'Sort Text' });

    await user.type(input, '1,10e2,3');
    await user.click(button);

    expect(validateCommaSeparatedNumbers).toHaveBeenCalledWith('1,10e2,3');
    expect(sortText).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid whole number: "10e2". Use whole numbers only (e.g. 1, 2, 15, -42).')).toBeInTheDocument();
  });

  it('Shows "Number too large" validation error and does not call sortText when input is invalid', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: false,
      error: 'Number too large: "1000000000000000000000000". Use whole numbers only (e.g. 1, 2, 15, -42).',
    });

    render(<NumberWords />);

    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    const button = screen.getByRole('button', { name: 'Sort Text' });

    await user.type(input, '1,1000000000000000000000000,3');
    await user.click(button);

    expect(validateCommaSeparatedNumbers).toHaveBeenCalledWith('1,1000000000000000000000000,3');
    expect(sortText).not.toHaveBeenCalled();
    expect(screen.getByText('Number too large: "1000000000000000000000000". Use whole numbers only (e.g. 1, 2, 15, -42).')).toBeInTheDocument();
  });

  it('Shows "Empty number detected" validation error and does not call sortText when input is invalid', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: false,
      error: 'Empty number detected. Please ensure all numbers are valid whole numbers (e.g. 1, 2, 15, -42).',
    });

    render(<NumberWords />);

    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    const button = screen.getByRole('button', { name: 'Sort Text' });

    await user.type(input, '1,,3');
    await user.click(button);

    expect(validateCommaSeparatedNumbers).toHaveBeenCalledWith('1,,3');
    expect(sortText).not.toHaveBeenCalled();
    expect(screen.getByText('Empty number detected. Please ensure all numbers are valid whole numbers (e.g. 1, 2, 15, -42).')).toBeInTheDocument();
  });

  it('Shows "Newline character detected" validation error and does not call sortText when input is invalid', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: false,
      error: 'Newline character detected. Please enter numbers separated by commas only.',
    });

    render(<NumberWords />);

    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    const button = screen.getByRole('button', { name: 'Sort Text' });

    await user.type(input, '1,2\n,3');
    await user.click(button);

    expect(validateCommaSeparatedNumbers).toHaveBeenCalledWith('1,2\n,3');
    expect(sortText).not.toHaveBeenCalled();
    expect(screen.getByText('Newline character detected. Please enter numbers separated by commas only.')).toBeInTheDocument();
  });

   it('Shows "Enter at least one number" validation error and does not call sortText when input is invalid', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: false,
      error: 'Enter at least one number (e.g. 1, 2, 15, -42).',
    });

    render(<NumberWords />);

    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: 'Sort Text' });

    await user.click(button);

    expect(validateCommaSeparatedNumbers).toHaveBeenCalledWith('');
    expect(sortText).not.toHaveBeenCalled();
    expect(screen.getByText('Enter at least one number (e.g. 1, 2, 15, -42).')).toBeInTheDocument();
  });

  it('Validates rendered returned text output', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: true,
      parts: [2, 10],
    });
    sortText.mockResolvedValue({
      data: [
        { type: 'text', number: 10, value: '10' },
        { type: 'text', number: 2, value: '2' }
      ],
    });

    render(<NumberWords />);

    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    const button = screen.getByRole('button', { name: 'Sort Text' });

    await user.type(input, '2,10');
    await user.click(button);

    await waitFor(() => {
      expect(sortText).toHaveBeenCalledWith([2,10]);
    });

    expect(screen.getByTestId('output-container')).toBeInTheDocument();
    expect(screen.getByTestId('output-text-item-0')).toHaveTextContent('10');
    expect(screen.getByTestId('output-text-item-1')).toHaveTextContent('2');
  });

  it('Validates rendered returned image output', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: true,
      parts: [10000, 10001],
    });
    sortText.mockResolvedValue({
      data: [
        { type: 'image', number: 10000, image: 'https://example.com/10000.png', value: 'Ten Thousand' },
        { type: 'image', number: 10001, image: 'https://example.com/10001.png', value: 'Ten Thousand One' }
      ],
    });

    render(<NumberWords />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Enter a comma separated list of whole numbers'), '1');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    await waitFor(() => {
      expect(screen.getByTestId('output-image-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('output-image-item-1')).toBeInTheDocument();
    });
    expect(screen.getByTestId('output-image-item-0')).toHaveAttribute(
      'src',
      'https://example.com/10000.png',
    );
    expect(screen.getByTestId('output-image-item-1')).toHaveAttribute(
      'src',
      'https://example.com/10001.png',
    );
  });

  it('Validates rendered returned text and image output', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: true,
      parts: [1,2,10000, 10001],
    });
    sortText.mockResolvedValue({
      data: [
        { type: 'text', number: 1, value: '1' },
        { type: 'image', number: 10000, image: 'https://example.com/10000.png', value: 'Ten Thousand' },
        { type: 'image', number: 10001, image: 'https://example.com/10001.png', value: 'Ten Thousand One' },
        { type: 'text', number: 2, value: '2' },
      ],
    });

    render(<NumberWords />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Enter a comma separated list of whole numbers'), '1');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    await waitFor(() => {
      expect(screen.getByTestId('output-text-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('output-image-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('output-image-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('output-text-item-3')).toBeInTheDocument();
    });
    expect(screen.getByTestId('output-text-item-0')).toHaveTextContent('1');
    expect(screen.getByTestId('output-image-item-1')).toHaveAttribute(
      'src',
      'https://example.com/10000.png',
    );
    expect(screen.getByTestId('output-image-item-2')).toHaveAttribute(
      'src',
      'https://example.com/10001.png',
    );
    expect(screen.getByTestId('output-text-item-3')).toHaveTextContent('2');
  });

  it('renders placeholder when image type has no URL', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: true,
      parts: [10000],
    });
    sortText.mockResolvedValue({
      data: [{ type: 'image', number: 10000, image: null, value: 'Ten Thousand' }],
    });

    render(<NumberWords />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Enter a comma separated list of whole numbers'), '1');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    await waitFor(() => {
      expect(screen.getByTestId('output-image-placeholder-0')).toBeInTheDocument();
    });
    expect(screen.getByTestId('output-image-placeholder-0')).toHaveTextContent(
      'Unable to load image.',
    );
  });
});
