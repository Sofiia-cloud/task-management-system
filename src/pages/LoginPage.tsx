import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../hooks/hooks';
import { signInWithEmail, signInWithGoogle } from '../services/authService';
import { TextField, Button, Paper, Typography, Link, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await dispatch(signInWithEmail(email, password));
    if (success) {
      navigate(from, { replace: true });
    } else {
      // Можно показать ошибку пользователю
      console.log('Login failed');
    }
  };

  const handleGoogleSignIn = async () => {
    const success = await dispatch(signInWithGoogle());
    if (success) {
      navigate(from, { replace: true });
    } else {
      // Можно показать ошибку пользователю
      console.log('Google login failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '50px',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '80%', md: '60%', lg: '40%' },
          maxWidth: '500px',
        }}
      >
        <Paper sx={{ padding: '20px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Sign In
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
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ margin: '20px 0' }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={handleGoogleSignIn}
              sx={{ marginBottom: '20px' }}
            >
              Sign In with Google
            </Button>
            <Typography align="center">
              Don&apos;t have an account? <Link href="/register">Register</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};
