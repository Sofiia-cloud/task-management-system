import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateBoardDialog } from './CreateBoardDialog';

describe('CreateBoardDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<CreateBoardDialog open={true} onClose={mockOnClose} onCreate={mockOnCreate} />);

    expect(screen.getByText('Create New Board')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<CreateBoardDialog open={false} onClose={mockOnClose} onCreate={mockOnCreate} />);

    expect(screen.queryByText('Create New Board')).not.toBeInTheDocument();
  });

  it('calls onCreate with title when form is submitted', () => {
    render(<CreateBoardDialog open={true} onClose={mockOnClose} onCreate={mockOnCreate} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Board' } });
    fireEvent.click(screen.getByText('Create'));

    expect(mockOnCreate).toHaveBeenCalledWith('New Board');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows error when trying to submit empty title', () => {
    render(<CreateBoardDialog open={true} onClose={mockOnClose} onCreate={mockOnCreate} />);

    fireEvent.click(screen.getByText('Create'));

    expect(screen.getByText('Board title is required')).toBeInTheDocument();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('closes when Cancel is clicked', () => {
    render(<CreateBoardDialog open={true} onClose={mockOnClose} onCreate={mockOnCreate} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });
});
