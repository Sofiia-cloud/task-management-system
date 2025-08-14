import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import styles from './CreateBoardDialog.module.css';

interface CreateBoardDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

export const CreateBoardDialog = ({ open, onClose, onCreate }: CreateBoardDialogProps) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      setError('Board title is required');
      return;
    }
    onCreate(title);
    setTitle('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog}>
      <DialogTitle className={styles.title}>Create New Board</DialogTitle>
      <DialogContent className={styles.content}>
        <TextField
          autoFocus
          margin="dense"
          label="Board Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!error}
          helperText={error}
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          className={styles.inputField}
        />
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button onClick={onClose} className={styles.cancelButton}>
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" className={styles.createButton}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
