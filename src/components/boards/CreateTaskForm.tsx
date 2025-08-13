import { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import styles from './CreateTaskForm.module.css';

interface CreateTaskFormProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, description?: string) => Promise<void>;
  boardId: string;
}

export const CreateTaskForm = ({ open, onClose, onCreate, boardId }: CreateTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsLoading(true);
    try {
      await onCreate(title, description);
      setTitle('');
      setDescription('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog}>
      <DialogTitle className={styles.title}>Create New Task</DialogTitle>
      <DialogContent className={styles.content}>
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
          className={styles.field}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          className={styles.field}
        />
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button onClick={onClose} disabled={isLoading} className={styles.button}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          {isLoading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
