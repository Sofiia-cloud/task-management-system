import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/hooks';
import { registerWithEmail } from '../services/authService';
import { TextField, Button, Paper, Typography, Link, Box } from '@mui/material';
import styles from './RegisterPage.module.css';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    dispatch(registerWithEmail(email, password)).then(() => {
      navigate('/');
    });
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.formContainer}>
        <Paper className={styles.paper}>
          <Typography variant="h5" align="center" gutterBottom className={styles.title}>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
            <Button type="submit" variant="contained" fullWidth className={styles.submitButton}>
              Register
            </Button>
            <Typography align="center" className={styles.linkText}>
              Already have an account?{' '}
              <Link href="/login" className={styles.link}>
                Sign In
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};
