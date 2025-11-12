import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Link as MuiLink, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { registerUser } from '../api/auth';
import { useTranslation } from 'react-i18next';

function Register() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const registeredUser = await registerUser(formData);
      // मान लो registerUser response में user data दे रहा है
      if (registeredUser) {
        localStorage.setItem('userId', registeredUser._id);
        localStorage.setItem('userName', registeredUser.name);
      }
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 6, mb: 6 }}>
          <Card elevation={5} sx={{ borderRadius: 3, animation: 'fadeIn 0.5s' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <PersonAddIcon sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                  {t('createAccount')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('registerSubtitle')}
                </Typography>
              </Box>

              <form onSubmit={handleRegister}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label={t('fullName')} name="name" variant="outlined" value={formData.name} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label={t('emailAddress')} name="email" type="email" variant="outlined" value={formData.email} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label={t('phoneNumber')} name="phone" type="tel" variant="outlined" value={formData.phone} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label={t('password')} name="password" type="password" variant="outlined" value={formData.password} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label={t('address')} name="address" variant="outlined" multiline rows={2} value={formData.address} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>{t('registerAs')}</InputLabel>
                      <Select name="role" value={formData.role} label="Register As" onChange={handleChange} required inputProps={{ style: { paddingRight: 206 } }}>
                        <MenuItem value="customer">{t('customerNeedsServices')}</MenuItem>
                        <MenuItem value="provider">{t('providerGivesServices')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Button fullWidth type="submit" variant="contained" size="large"
                  sx={{ mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2, '&:hover': { transform: 'scale(1.02)', boxShadow: 4 } }}
                >
                  {t('register')}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('alreadyAccount')}{' '}
                    <MuiLink component={Link} to="/login" sx={{ color: '#667eea', fontWeight: 'bold', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      {t('loginHere')}
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

export default Register;
