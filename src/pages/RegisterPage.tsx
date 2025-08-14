import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { registerWithEmail } from '../services/authService';
import { TextField, Button, Paper, Typography, Link, Box, Alert } from '@mui/material';
import styles from './RegisterPage.module.css';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const { error: authError } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const result = await registerWithEmail(email, password)(dispatch);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
      console.error('Registration error:', err);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.formContainer}>
        <Paper className={styles.paper}>
          <Typography variant="h5" align="center" gutterBottom className={styles.title}>
            Register
          </Typography>

          {}
          {(error || authError) && (
            <Alert severity="error" className={styles.alert}>
              {error || authError}
            </Alert>
          )}

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
              error={!!error}
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
              error={!!error}
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
              error={!!error}
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
