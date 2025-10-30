import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, TextField, Button, Chip, Avatar, Rating, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function CustomerDashboard() {
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
        const res = await axios.get('/api/providers');
        setProviders(res.data);
      } catch (error) {
        toast.error("Could not load providers!");
      }
      setLoading(false);
    }
    fetchProviders();
  }, []);

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

  // Send booking to backend on confirm
  const handleConfirmBooking = async () => {
    if (!selectedProvider || !bookingDate || !bookingTime || !bookingAddress) {
      toast.error("Please enter all booking details!");
      return;
    }
    // BUILD BOOKING PAYLOAD
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
      await axios.post('/api/bookings', bookingPayload);
      toast.success(
        `Booking confirmed with ${selectedProvider.user?.name || selectedProvider.name}!`
      );
      handleCloseBooking();
    } catch (error) {
      toast.error("Booking failed!");
    }
  };

  // Filtering provider list
  const filteredProviders = providers.filter(provider =>
    (provider.service?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedService === '' || provider.service === selectedService)
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
              Find Service Providers Near You
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/booking-history')}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': { background: '#667eea', color: 'white' }
                }}
              >
                Booking History
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/customer-profile')}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': { background: '#667eea', color: 'white' }
                }}
              >
                Create/Edit Profile
              </Button>
            </Box>
          </Box>

          <Card elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search for services..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Service</InputLabel>
                  <Select
                    value={selectedService}
                    label="Filter by Service"
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <MenuItem value="">All Services</MenuItem>
                    <MenuItem value="Electrician">Electrician</MenuItem>
                    <MenuItem value="Plumber">Plumber</MenuItem>
                    <MenuItem value="Painter">Painter</MenuItem>
                    <MenuItem value="Labor">Labor</MenuItem>
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
                    height: '56px'
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {loading ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
            Loading providers...
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredProviders.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
                  No providers found.
                </Typography>
              </Grid>
            )}
            {filteredProviders.map((provider) => (
              <Grid item xs={12} sm={6} md={6} key={provider._id}>
                <Card
                  elevation={3}
                  sx={{
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 70,
                          height: 70,
                          mr: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                        src={provider.profileImage}
                      >
                        {provider.user?.name
                          ? provider.user.name.split(' ').map(n => n[0]).join("")
                          : "U"}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                          {provider.user?.name}
                        </Typography>
                        <Chip
                          label={provider.service}
                          size="small"
                          color="primary"
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Rating value={provider.rating || 0} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" sx={{ ml: 1, color: 'gray' }}>
                            ({provider.rating?.toFixed(1) || "0.0"})
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Experience: {provider.experience}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: 'gray', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {provider.city}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: 'gray', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {provider.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                        ₹{provider.hourlyRate}/hr
                      </Typography>
                      <Box>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(`/reviews/${provider._id}`)}
                          sx={{ mr: 1 }}
                        >
                          Reviews
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleBookNow(provider)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={openBooking} onClose={handleCloseBooking} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>
            Confirm Booking
          </DialogTitle>
          <DialogContent>
            {selectedProvider && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You are booking <strong>{selectedProvider.user?.name}</strong> for <strong>{selectedProvider.service}</strong> service.
                </Typography>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  placeholder="Enter your address..."
                  value={bookingAddress}
                  onChange={(e) => setBookingAddress(e.target.value)}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseBooking} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBooking}
              variant="contained"
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>

        <Footer />
      </Container>
    </>
  );
}

export default CustomerDashboard;
