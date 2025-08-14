import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../hooks/hooks';
import { signInWithEmail, signInWithGoogle } from '../services/authService';
import { TextField, Button, Paper, Typography, Link, Box, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const success = await signInWithEmail(email, password)(dispatch);

      if (success) {
        navigate(from, { replace: true });
      } else {
        setAuthError('Wrong email or password');
      }
    } catch (error) {
      setAuthError('Error occurred when logging in');
      console.error('Login error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      const success = await signInWithGoogle()(dispatch);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setAuthError('Error logging in by Google');
      }
    } catch (error) {
      setAuthError('Error occurred when logging in by Google');
      console.error('Google login error:', error);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.formContainer}>
        <Paper className={styles.paper}>
          <Typography variant="h5" align="center" gutterBottom className={styles.title}>
            Sign In
          </Typography>

          {}
          {authError && (
            <Alert severity="error" className={styles.alert}>
              {authError}
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
            <Button type="submit" variant="contained" fullWidth className={styles.submitButton}>
              Sign In
            </Button>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={handleGoogleSignIn}
              className={styles.googleButton}
            >
              Sign In with Google
            </Button>
            <Typography align="center" className={styles.linkText}>
              Do not have an account?{' '}
              <Link href="/register" className={styles.link}>
                Register
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};
