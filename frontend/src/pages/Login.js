import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginIcon from '@mui/icons-material/Login';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { loginUser } from '../api/auth';
import { useTranslation } from 'react-i18next';


function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const role = '';
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password, role });
      const loggedInUser = data.user;
      if (loggedInUser && data.token) {
        localStorage.setItem('userId', loggedInUser._id);
        localStorage.setItem('userName', loggedInUser.name);
        localStorage.setItem('role', loggedInUser.role);
      }
      toast.success('Login successful!');
      if (loggedInUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (loggedInUser.role === 'provider') {
        localStorage.setItem('justLoggedInProvider', 'yes');
        navigate('/provider-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    } catch (err) {
      localStorage.clear();
      if (err.response?.status === 403) {
        toast.error('Your account is inactive or deleted. Please contact support.');
      } else {
        toast.error(err.response?.data?.error || 'Login failed');
      }
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 8 }}>
          <Card elevation={5} sx={{ borderRadius: 3, animation: 'fadeIn 0.5s' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <LoginIcon sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>{t('login')}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('loginSubtitle')}
                </Typography>
              </Box>
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label={t('emailAddress')}
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label={t('password')}
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                />
                {/* <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Login As</InputLabel>
                  <Select
                    value={role}
                    label="Login As"
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="provider">Service Provider</MenuItem>
                  </Select>
                </FormControl> */}
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 4
                    }
                  }}
                >
                  {t('login')}
                </Button>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                   {t('noAccount')}?{' '}
                    <MuiLink
                      component={Link}
                      to="/register"
                      sx={{ color: '#667eea', fontWeight: 'bold', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {t('registerHere')}
                    </MuiLink>
                  </Typography>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default Login;
