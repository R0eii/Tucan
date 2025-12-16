import { useState } from 'react';
import { Box, Button, TextField, Typography, Link as MuiLink, InputAdornment, IconButton, Alert } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join Tucan and start monitoring your fleet today."
    >
      <Box component="form" onSubmit={handleSubmit}>
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          placeholder="John Doe"
          InputProps={{
            startAdornment: <InputAdornment position="start"><User size={20} color="#94a3b8"/></InputAdornment>,
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          placeholder="name@company.com"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Mail size={20} color="#94a3b8"/></InputAdornment>,
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          placeholder="Create a strong password"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Lock size={20} color="#94a3b8"/></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />
        
        <Button 
          fullWidth 
          variant="contained" 
          size="large" 
          type="submit" 
          disabled={isLoading}
          sx={{ 
            py: 1.5, 
            bgcolor: '#0f172a',
            fontSize: '1rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#1e293b' }
          }}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={RouterLink} to="/login" fontWeight={700} color="primary" underline="hover">
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
}