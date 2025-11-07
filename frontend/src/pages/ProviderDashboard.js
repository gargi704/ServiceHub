import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Grid, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api.js';

function ProviderDashboard() {
  const userRole = localStorage.getItem('role');
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    earnings: 0,
    completedJobs: 0,
    rating: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/login');
      return;
    }
    setUserId(storedUserId);
    axios.get(`${API_BASE_URL}/api/users/${storedUserId}`)
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem('justLoggedInProvider') === 'yes') {
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
        localStorage.removeItem('justLoggedInProvider');
      }, 3000);
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/login');
      return;
    }
    setUserId(storedUserId);
  }, [navigate]);

  const fetchAllData = async () => {
    if (!userId) return;
    try {
      const providerRes = await axios.get(`${API_BASE_URL}/api/providers/by-user/${userId}`);
      const providerData = providerRes.data;
      if (!providerData || !providerData._id) {
        setProfile(null);
        setBookings([]);
        setStats({ totalBookings: 0, earnings: 0, completedJobs: 0, rating: 0 });
        return;
      }
      setProfile(providerData);
      localStorage.setItem('providerId', providerData._id);
      const bookingsRes = await axios.get(`${API_BASE_URL}/api/bookings/provider/${providerData._id}`);
      setBookings(bookingsRes.data);
      const completedJobs = bookingsRes.data.filter(b => b.status === 'completed').length;
      const earnings = bookingsRes.data
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.amount), 0);
      setStats({
        totalBookings: bookingsRes.data.length,
        earnings,
        completedJobs,
        rating: providerData.rating,
      });
    } catch (e) {
      setProfile(null);
      setBookings([]);
      setStats({ totalBookings: 0, earnings: 0, completedJobs: 0, rating: 0 });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [userId]);

  const handleAcceptBooking = async (bookingId) => {
    await axios.patch(`${API_BASE_URL}/api/bookings/status/${bookingId}`, { status: 'accepted' });
    fetchAllData();
  };

  const handleMarkComplete = async (bookingId) => {
    await axios.patch(`${API_BASE_URL}/api/bookings/status/${bookingId}`, { status: 'completed' });
    fetchAllData();
  };

  const handleCancelBooking = async (bookingId) => {
    await axios.patch(`${API_BASE_URL}/api/bookings/status/${bookingId}`, { status: 'cancelled' });
    fetchAllData();
  };

  return (
    <>
      <Navbar />
      <Snackbar
        open={showWelcome}
        anchorOrigin={{ vertical: 'middle', horizontal: 'center' }}
        sx={{ zIndex: 9999 }}
      >
        <MuiAlert
          elevation={10}
          variant="filled"
          severity="success"
          icon={false}
          sx={{ fontWeight: 'bold', fontSize: 22, py: 2, px: 6, justifyContent: 'center' }}
        >
          🎉 Welcome {profile?.user?.name ? profile.user.name : user?.name ? user.name : ""}!
        </MuiAlert>
      </Snackbar>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 3, md: 6 } }}>
        {/* Header */}
        <Box sx={{
          mb: { xs: 2, md: 4 }
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 },
            mb: 2
          }}>
            <Avatar
              src={
                profile?.profileImage
                  ? (profile.profileImage.startsWith('http')
                    ? profile.profileImage
                    : `${API_BASE_URL}${profile.profileImage}`)
                  : undefined
              }
              sx={{
                width: 70, height: 70, mr: { sm: 3, xs: 0 },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '2.1rem',
                fontWeight: 'bold',
                mb: { xs: 2, sm: 0 }, mx: { xs: 'auto', sm: 0 }
              }}
            >
              {profile?.user?.name ? profile.user.name.split(" ").map(n => n[0]).join("") : user?.name ? user.name.split(" ").map(n => n[0]).join("") : "RK"}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 'bold', color: '#333',
                fontSize: { xs: 22, md: 30 }
              }}>
                {profile?.user?.name ? profile.user.name : user?.name ? user.name : "Provider"}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 15, sm: 17 } }}>
                {profile?.service} | {profile?.experience}+ years experience
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, mb: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/provider-service-history')}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 600,
                '&:hover': { background: '#667eea', color: 'white' }
              }}
            >
              Service History
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/provider-profile')}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 600,
                '&:hover': { background: '#667eea', color: 'white' }
              }}
            >
              Create/Edit Profile
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', minHeight: 110
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 20, md: 28 } }}>
                      {stats.totalBookings}
                    </Typography>
                    <Typography variant="body2">Total Bookings</Typography>
                  </Box>
                  <WorkIcon sx={{ fontSize: 45, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white', minHeight: 110
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 20, md: 28 } }}>
                      ₹{stats.earnings}
                    </Typography>
                    <Typography variant="body2">Total Earnings</Typography>
                  </Box>
                  <AttachMoneyIcon sx={{ fontSize: 45, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white', minHeight: 110
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 20, md: 28 } }}>
                      {stats.completedJobs}
                    </Typography>
                    <Typography variant="body2">Completed Jobs</Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 45, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white', minHeight: 110
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 20, md: 28 } }}>
                      {stats.rating}
                    </Typography>
                    <Typography variant="body2">Average Rating</Typography>
                  </Box>
                  <StarIcon sx={{ fontSize: 45, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bookings Table */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" sx={{
              mb: 3, fontWeight: 'bold', color: '#333',
              fontSize: { xs: 18, md: 24 }
            }}>
              Recent Bookings
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{
              width: '100%',
              overflowX: 'auto'
            }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: { xs: 12, md: 15 } }}>Booking ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: { xs: 12, md: 15 } }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: { xs: 12, md: 15 } }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: { xs: 12, md: 15 } }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: { xs: 12, md: 15 } }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: { xs: 12, md: 15 } }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: { xs: 12, md: 15 } }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking, idx) => (
                    <TableRow key={booking._id} hover>
                      <TableCell sx={{ fontSize: { xs: 12, md: 15 } }}>#{idx + 1}</TableCell>
                      <TableCell sx={{ fontSize: { xs: 12, md: 15 } }}>{booking.customer?.name || '-'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: 12, md: 15 } }}>{booking.service}</TableCell>
                      <TableCell sx={{ fontSize: { xs: 12, md: 15 } }}>{new Date(booking.date).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#667eea', fontSize: { xs: 12, md: 15 } }}>
                        ₹{booking.amount}
                      </TableCell>
                      <TableCell>
                        {booking.status === 'pending' ? (
                          <Chip
                            icon={<PendingIcon />}
                            label="Pending"
                            color="warning"
                            size="small"
                            sx={{ fontSize: 11 }}
                          />
                        ) : (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Completed"
                            color="success"
                            size="small"
                            sx={{ fontSize: 11 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {booking.status === 'pending' && (
                          <>
                            <Button onClick={() => handleAcceptBooking(booking._id)} variant="contained" color="primary" size="small" sx={{ mr: 1, fontSize: 11 }}>Accept</Button>
                            <Button onClick={() => handleCancelBooking(booking._id)} variant="outlined" color="error" size="small" sx={{ fontSize: 11 }}>Cancel</Button>
                          </>
                        )}
                        {booking.status === 'accepted' && (
                          <>
                            <Button onClick={() => handleMarkComplete(booking._id)} variant="contained" color="success" size="small" sx={{ mr: 1, fontSize: 11 }}>Complete</Button>
                            <Button onClick={() => handleCancelBooking(booking._id)} variant="outlined" color="error" size="small" sx={{ fontSize: 11 }}>Cancel</Button>
                          </>
                        )}
                        {booking.status === 'completed' && (
                          <Chip label="Completed" color="success" size="small" sx={{ fontSize: 11 }} />
                        )}
                        {booking.status === 'cancelled' && (
                          <Chip label="Cancelled" color="error" size="small" sx={{ fontSize: 11 }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default ProviderDashboard;
