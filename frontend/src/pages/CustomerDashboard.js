import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, Grid, TextField, Button, Chip, Avatar, Rating, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../api.js';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

function CustomerDashboard() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking dialog fields
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const navigate = useNavigate();
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/providers`);
        setProviders(res.data);
      } catch (error) {
        toast.error(t('couldNotLoadProviders'));
      }
      setLoading(false);
    }
    fetchProviders();
  }, [t]);


  const handleBookNow = (provider) => {
    setSelectedProvider(provider);
    setOpenBooking(true);
    setBookingDate('');
    setBookingTime('');
    setBookingAddress('');
  };

  const handleCloseBooking = () => {
    setOpenBooking(false);
    setSelectedProvider(null);
    setBookingDate('');
    setBookingTime('');
    setBookingAddress('');
  };

  const handleConfirmBooking = async () => {
    if (!selectedProvider || !bookingDate || !bookingTime || !bookingAddress) {
      toast.error(t('pleaseEnterBookingDetails'));
      return;
    }
    const bookingPayload = {
      customer: customerId,
      provider: selectedProvider._id,
      service: selectedProvider.service,
      date: bookingDate,
      time: bookingTime,
      address: bookingAddress,
      amount: selectedProvider.hourlyRate,
      status: 'pending'
    };
    try {
      await axios.post(`${API_BASE_URL}/api/bookings`, bookingPayload);
      toast.success(
        t('bookingConfirmed', { name: selectedProvider.user?.name || selectedProvider.name })
      );
      handleCloseBooking();
    } catch (error) {
      toast.error(t('bookingFailed'));
    }
  };

  const filteredProviders = providers.filter(provider =>
    (provider.service?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedService === '' || provider.service === selectedService)
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 3, md: 6 }, px: { xs: 0.5, sm: 2 } }}>
        {/* Header section */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              mb: 3, gap: 1
            }}
          >
            <Typography variant="h4" sx={{
              fontWeight: 'bold',
              color: '#333',
              fontSize: { xs: 20, sm: 26, md: 30 }
            }}>
              {t('findServiceProvidersNearYou')}
            </Typography>
            <Box sx={{
              display: 'flex',
              gap: 1.5,
              flexDirection: { xs: 'column', sm: 'row' },
              mb: { xs: 2, sm: 0 }
            }}>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/booking-history')}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontSize: { xs: 13.5, sm: 15 },
                  px: 2,
                  '&:hover': { background: '#667eea', color: 'white' }
                }}
              >
                {t('bookingHistory')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/customer-profile')}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontSize: { xs: 13.5, sm: 15 },
                  px: 2,
                  '&:hover': { background: '#667eea', color: 'white' }
                }}
              >
                {t('createEditProfile')}
              </Button>
            </Box>
          </Box>
          {/* Search Filter Card */}
          <Card elevation={3} sx={{ p: { xs: 1, sm: 2.2 }, boxShadow: { xs: 1, sm: 4 }, mt: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder={t('searchForServices...')}
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} />
                  }}
                  sx={{ fontSize: 14 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by Service</InputLabel>
                  <Select
                    value={selectedService}
                    label={t('filterByService')}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <MenuItem value="">{t('allServices')}</MenuItem>
                    <MenuItem value="Electrician">{t('electrician')}</MenuItem>
                    <MenuItem value="Plumber">{t('plumber')}</MenuItem>
                    <MenuItem value="Painter">{t('painter')}</MenuItem>
                    <MenuItem value="Labor">{t('labor')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: { xs: '38px', sm: '48px' },
                    fontWeight: 600,
                    fontSize: { xs: 14, sm: 16 }
                  }}
                >
                  {t('search')}
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Providers List Section */}
        {loading ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
            {t('loadingProviders...')}
          </Typography>
        ) : (
          <Grid container spacing={{ xs: 1.3, md: 2.5 }}>
            {filteredProviders.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
                  {t('noProvidersFound')}.
                </Typography>
              </Grid>
            )}
            {filteredProviders.map((provider) => (
              <Grid item xs={12} sm={6} md={4} key={provider._id}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s',
                    p: { xs: 1.4, sm: 2.2 },
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.022)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.4 }}>
                    <Avatar
                      sx={{
                        width: 50, height: 50, mr: 1.5,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: 20
                      }}
                      src={provider.profileImage}
                    >
                      {provider.user?.name
                        ? provider.user.name.split(' ').map(n => n[0]).join("")
                        : "U"}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: 14, sm: 16.5 } }}>
                        {provider.user?.name}
                      </Typography>
                      <Chip label={provider.service} size="small" color="primary" sx={{ mb: 0.5, fontSize: 11 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={provider.rating || 0} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 0.6, color: 'gray', fontSize: 11.5 }}>
                          ({provider.rating?.toFixed(1) || "0.0"})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <b>{t('Experience')}:</b> {provider.experience} yrs
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 17, color: 'gray', mr: 0.7 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                      {provider.city}
                    </Typography>
                    <PhoneIcon sx={{ fontSize: 17, color: 'gray', ml: 1.4, mr: 0.7 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                      {provider.phone}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 'bold', fontSize: 14.7, mb: 1 }}>
                    ₹{provider.hourlyRate}/hr
                  </Typography>
                  {/* Action Buttons */}
                  <Box sx={{
                    mt: 1, display: 'flex', gap: 1,
                    justifyContent: { xs: "center", sm: "flex-end" }
                  }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/reviews/${provider._id}`)}
                      sx={{ fontSize: 12, py: 0.54, px: 1.6, minWidth: 64 }}
                    >
                      {t('reviews')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleBookNow(provider)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: 12, py: 0.54, px: 1.6, minWidth: 80,
                        '&:hover': { transform: 'scale(1.045)' }
                      }}
                    >
                      {t('bookNow')}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Booking Dialog */}
        <Dialog open={openBooking} onClose={handleCloseBooking} maxWidth="xs" fullWidth
          PaperProps={{
            sx: {
              mx: { xs: 0.5, sm: 2 },
              my: { xs: 2, sm: 4 },
              px: { xs: 0.5, sm: 2 },
              borderRadius: 3
            }
          }}>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: 17, sm: 20 } }}>
            {t('confirmBooking')}
          </DialogTitle>
          <DialogContent>
            {selectedProvider && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2, fontSize: { xs: 13, sm: 15 } }}>
                  <Trans
                    i18nKey="youAreBooking"
                    values={{
                      name: selectedProvider.user?.name,
                      service: selectedProvider.service
                    }}
                    components={{ 1: <strong />, 3: <strong /> }}
                  />
                </Typography>

                <TextField
                  fullWidth
                  label={t('date')}
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 1.4 }}
                  size="small"
                />
                <TextField
                  fullWidth
                  label={t('time')}
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 1.4 }}
                  size="small"
                />
                <TextField
                  fullWidth
                  label={t('address')}
                  multiline
                  rows={3}
                  placeholder="Enter your address..."
                  value={bookingAddress}
                  onChange={(e) => setBookingAddress(e.target.value)}
                  size="small"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
            <Button onClick={handleCloseBooking} variant="outlined" fullWidth size="medium">{t('cancel')}</Button>
            <Button
              onClick={handleConfirmBooking}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                fontSize: { xs: 14, sm: 15 }
              }}
              fullWidth
              size="medium"
            >
              {t('confirmBooking')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </>
  );
}

export default CustomerDashboard;
