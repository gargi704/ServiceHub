import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Chip, Button, Tabs, Tab, Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Rating } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api.js';

function BookingHistory() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!customerId) return;
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings/customer/` + customerId)
        setBookings(res.data);
      } catch (err) {
        setBookings([]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [customerId]);

  // Filter bookings by status
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'accepted');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const getStatusColor = status => {
    if (status === 'completed') return 'success';
    if (status === 'pending' || status === 'accepted') return 'warning';
    if (status === 'cancelled') return 'error';
    return 'default';
  };

  const getStatusIcon = status => {
    if (status === 'completed') return <CheckCircleIcon />;
    if (status === 'pending' || status === 'accepted') return <PendingIcon />;
    if (status === 'cancelled') return <CancelIcon />;
    return null;
  };

  const handleTabChange = (e, v) => setTabValue(v);

  const handleViewDetails = booking => {
    setSelectedBooking(booking);
    setOpenDetailsDialog(true);
  };
  const handleCloseDialog = () => {
    setSelectedBooking(null);
    setOpenDetailsDialog(false);
  };

  const handleCancelBooking = async (bookingId) => {
    await axios.patch(`${API_BASE_URL}/api/bookings/status/${bookingId}`, { status: 'cancelled' });
    const res = await axios.get(`${API_BASE_URL}/api/bookings/customer/${customerId}`);
    setBookings(res.data);
  };

  // Tab filter
  const getCurrentBookings = () => {
    if (tabValue === 0) return bookings;
    if (tabValue === 1) return completedBookings;
    if (tabValue === 2) return pendingBookings;
    if (tabValue === 3) return cancelledBookings;
    return bookings;
  };

  // Booking card
  const BookingCard = ({ booking }) => (
    <Card elevation={3} sx={{ mb: 3, borderRadius: 4 }}>
      <CardContent>
        <Grid container spacing={2}>
          {/* Left section */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 56, height: 56, fontSize: 28,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', mr: 2
                }}
              >
                {booking.provider?.user?.name ? booking.provider.user.name[0] : ''}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  {booking.provider?.user?.name || '--'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.provider?.service || booking.service || '--'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip
                    icon={getStatusIcon(booking.status)}
                    label={(booking.status === 'accepted' ? 'PENDING (ACCEPTED)' : booking.status?.toUpperCase())}
                    color={getStatusColor(booking.status)}
                    size="small"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Service ID: #{booking._id}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Date</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {new Date(booking.date).toLocaleDateString('en-IN')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Time</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {booking.time}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Service Location</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {booking.address}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Provider Phone</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {booking.provider?.phone || booking.provider?.user?.phone || "--"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Right section */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
            <Typography variant="caption" color="text.secondary">Earnings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea', mb: 2 }}>
              ₹{booking.amount}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              Customer Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 2, mt: 0.5 }}>
              <Rating value={booking.provider?.rating || booking.rating || 0} readOnly size="medium" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#fbc02d" }}>
                {booking.provider?.rating
                  ? booking.provider.rating.toFixed(1)
                  : (booking.rating ? booking.rating : '--')
                }
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => handleViewDetails(booking)}
              sx={{ mb: 1 }}
            >
              View Details
            </Button>
            {(booking.status === 'pending' || booking.status === 'accepted') && (
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => handleCancelBooking(booking._id)}
                sx={{ mt: 1 }}
              >
                Cancel Booking
              </Button>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customer-dashboard')}
          sx={{ mb: 3, color: '#667eea' }}
        >Back to Dashboard</Button>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
            Booking History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View all your past and upcoming bookings
          </Typography>
        </Box>
        {/* Status summary cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{bookings.length}</Typography>
                <Typography variant="body2">Total Bookings</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{completedBookings.length}</Typography>
                <Typography variant="body2">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{pendingBookings.length}</Typography>
                <Typography variant="body2">Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{cancelledBookings.length}</Typography>
                <Typography variant="body2">Cancelled</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Tabs */}
        <Card elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`All (${bookings.length})`} />
              <Tab label={`Completed (${completedBookings.length})`} />
              <Tab label={`Pending (${pendingBookings.length})`} />
              <Tab label={`Cancelled (${cancelledBookings.length})`} />
            </Tabs>
          </Box>
        </Card>
        {/* Booking list */}
        <Box sx={{ mt: 3 }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : getCurrentBookings().length > 0 ? (
            getCurrentBookings().map((booking) =>
              <BookingCard key={booking._id} booking={booking} />
            )
          ) : (
            <Card elevation={2}><CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">No bookings found</Typography>
            </CardContent></Card>
          )}
        </Box>
      </Container>
      {/* Booking Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: "600px",
            p: 3,
            minWidth: 500,
            minHeight: 300,
            m: "0 auto"
          }
        }}
      >
        {selectedBooking && (
          <DialogContent sx={{ pt: 0.1, pb: 0.1, minWidth: 300 }}>
            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {selectedBooking.service}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" sx={{ color: "gray" }}>Service ID</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  #{selectedBooking._id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="body2" sx={{ color: "gray" }}>Status</Typography>
                <Chip
                  icon={getStatusIcon(bookings.status)}
                  label={
                    bookings.status
                      ? bookings.status.toUpperCase()
                      : "--"
                  }
                  color={getStatusColor(bookings.status)}
                  size="small"
                  sx={{ mr: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: "gray" }}>Provider Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {selectedBooking.provider?.user?.name || "--"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" sx={{ color: "gray" }}>Service Type</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {selectedBooking.provider?.service || selectedBooking.service || "--"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="body2" sx={{ color: "gray" }}>Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {new Date(selectedBooking.date).toLocaleDateString("en-IN")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" sx={{ color: "gray" }}>Time</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {selectedBooking.time}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant="body2" sx={{ color: "gray" }}>Service Location</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {selectedBooking.address}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="body2" sx={{ color: "gray" }}>Earnings</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#667eea" }}>
                  ₹{selectedBooking.amount}
                </Typography>
              </Grid>
            </Grid>
            {/* Second ROW */}
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: "gray" }}>Provider Phone</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {selectedBooking.provider?.phone || selectedBooking.provider?.user?.phone || "--"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: "gray" }}>Customer Rating</Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <Rating value={selectedBooking.provider?.rating || selectedBooking.rating || 0} readOnly size="medium" />
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fbc02d", ml: 1 }}>
                    {selectedBooking.provider?.rating
                      ? selectedBooking.provider.rating.toFixed(1)
                      : (selectedBooking.rating ? selectedBooking.rating : '--')
                    }
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {/* CLOSE BUTTON */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleCloseDialog}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  width: 120,
                  fontWeight: "bold"
                }}
              >
                CLOSE
              </Button>
            </Box>
          </DialogContent>
        )}
      </Dialog>
      <Footer />
    </>
  );
}

export default BookingHistory;
