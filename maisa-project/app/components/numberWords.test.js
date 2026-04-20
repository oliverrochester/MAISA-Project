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

  it('renders input and sort button with initial empty state', () => {
    render(<NumberWords />);

    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    const button = screen.getByRole('button', { name: 'Sort Text' });

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(button).toBeInTheDocument();
    expect(screen.queryByTestId('output-container')).not.toBeInTheDocument();
  });

  it('shows validation error and does not call sortText when input is invalid', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: false,
      error: 'Please enter valid whole numbers.',
    });

    render(<NumberWords />);

    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    const button = screen.getByRole('button', { name: 'Sort Text' });

    await user.type(input, '1,a,3');
    await user.click(button);

    expect(validateCommaSeparatedNumbers).toHaveBeenCalledWith('1,a,3');
    expect(sortText).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter valid whole numbers.')).toBeInTheDocument();
  });

  it('calls sortText with parsed values and renders returned text output', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: true,
      parts: [10, 2],
    });
    sortText.mockResolvedValue({
      data: [{ type: 'text', value: '2, 10' }],
    });

    render(<NumberWords />);

    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    const button = screen.getByRole('button', { name: 'Sort Text' });

    await user.type(input, '10,2');
    await user.click(button);

    await waitFor(() => {
      expect(sortText).toHaveBeenCalledWith([10, 2]);
    });

    expect(screen.getByTestId('output-container')).toBeInTheDocument();
    expect(screen.getByTestId('output-text-item-0')).toHaveTextContent('2, 10');
  });

  it('does not show output and logs when sortText rejects', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: true,
      parts: [1],
    });
    sortText.mockRejectedValue(new Error('network'));

    render(<NumberWords />);

    const user = userEvent.setup();
    const input = screen.getByLabelText('Enter a comma separated list of whole numbers');
    await user.type(input, '1');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    await waitFor(() => {
      expect(sortText).toHaveBeenCalled();
    });

    expect(screen.queryByTestId('output-container')).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('renders image item when response includes image URL', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: true,
      parts: [1],
    });
    sortText.mockResolvedValue({
      data: [{ type: 'image', image: 'https://example.com/x.png' }],
    });

    render(<NumberWords />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Enter a comma separated list of whole numbers'), '1');
    await user.click(screen.getByRole('button', { name: 'Sort Text' }));

    await waitFor(() => {
      expect(screen.getByTestId('output-image-item-0')).toBeInTheDocument();
    });
    expect(screen.getByTestId('output-image-item-0')).toHaveAttribute(
      'src',
      'https://example.com/x.png',
    );
  });

  it('renders placeholder when image type has no URL', async () => {
    validateCommaSeparatedNumbers.mockReturnValue({
      ok: true,
      parts: [1],
    });
    sortText.mockResolvedValue({
      data: [{ type: 'image', image: null }],
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
