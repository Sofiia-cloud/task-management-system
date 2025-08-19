import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateTaskForm } from './CreateTaskForm';
import '@testing-library/jest-dom';

describe('CreateTaskForm', () => {
  const mockOnClose = jest.fn();
  const mockOnCreate = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <CreateTaskForm open={true} onClose={mockOnClose} onCreate={mockOnCreate} boardId="1" />,
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <CreateTaskForm open={false} onClose={mockOnClose} onCreate={mockOnCreate} boardId="1" />,
    );

    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('updates title and description fields when user types', () => {
    render(
      <CreateTaskForm open={true} onClose={mockOnClose} onCreate={mockOnCreate} boardId="1" />,
    );

    const titleInput = screen.getByLabelText(/Task Title/i);
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    expect(titleInput).toHaveValue('New Task');

    const descInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descInput, { target: { value: 'Task description' } });
    expect(descInput).toHaveValue('Task description');
  });

  it('calls onCreate with title and description when form is submitted', async () => {
    render(
      <CreateTaskForm open={true} onClose={mockOnClose} onCreate={mockOnCreate} boardId="1" />,
    );

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: 'New Task' },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Task description' },
    });
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith('New Task', 'Task description');
    });
  });

  it('does not submit when title is empty', async () => {
    render(
      <CreateTaskForm open={true} onClose={mockOnClose} onCreate={mockOnCreate} boardId="1" />,
    );

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(mockOnCreate).not.toHaveBeenCalled();
    });
  });

  it('closes when Cancel is clicked', () => {
    render(
      <CreateTaskForm open={true} onClose={mockOnClose} onCreate={mockOnCreate} boardId="1" />,
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('resets form after successful submission', async () => {
    render(
      <CreateTaskForm open={true} onClose={mockOnClose} onCreate={mockOnCreate} boardId="1" />,
    );

    const titleInput = screen.getByLabelText(/Task Title/i);
    const descInput = screen.getByLabelText(/Description/i);

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descInput, { target: { value: 'Description' } });
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descInput).toHaveValue('');
    });
  });
});
