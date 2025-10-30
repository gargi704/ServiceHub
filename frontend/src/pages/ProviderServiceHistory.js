import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Chip, Button, Tabs, Tab, Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

function ProviderServiceHistory() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    const providerId = localStorage.getItem('providerId'); 
    if (!providerId) return;
    //  console.log('ProviderId from localStorage:', providerId);
    axios.get(`/api/bookings/provider/${providerId}`)
      .then(res => {
        setAllServices(
          res.data.map(b => ({
            id: b._id,
            customer: b.customer?.name || '--',
            customerPhone: b.customer?.phone || '--',
            service: b.service,
            date: b.date,
            time: b.time,
            status: b.status,
            amount: `₹${b.amount}`,
            address: b.address,
            customerRating: b.rating || null,
            customerReview: b.review || null,
          }))
        );
      })
      .catch(() => setAllServices([]));
  }, []);

  const completedServices = allServices.filter(s => s.status === 'completed');
  const pendingServices = allServices.filter(s => s.status === 'pending' || s.status === 'accepted');
  const cancelledServices = allServices.filter(s => s.status === 'cancelled');
  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleViewDetails = (service) => {
    setSelectedService(service);
    setOpenDetailsDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedService(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'pending': return <PendingIcon />;
      case 'accepted': return <PendingIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return null;
    }
  };
  const getCurrentServices = () => {
    switch (tabValue) {
      case 0: return allServices;
      case 1: return completedServices;
      case 2: return pendingServices;
      case 3: return cancelledServices;
      default: return allServices;
    }
  };

  const ServiceCard = ({ service }) => (
    <Card elevation={3} sx={{ mb: 3, transition: 'all 0.3s', '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                {service.customer.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  {service.customer}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.service}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip
                    icon={getStatusIcon(service.status)}
                    label={service.status.toUpperCase()}
                    color={getStatusColor(service.status)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                    Service ID: #{service.id}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Date</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {new Date(service.date).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Time</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{service.time}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Service Location</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{service.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Customer Phone</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{service.customerPhone}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="caption" color="text.secondary">Earnings</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea', mb: 2 }}>
                {service.amount}
              </Typography>
              {(service.status === 'completed' && service.customerRating) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Customer Rating</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffa726' }}>
                    {service.customerRating} ⭐
                  </Typography>
                </Box>
              )}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => handleViewDetails(service)}
              >
                View Details
              </Button>
            </Box>
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
          onClick={() => navigate('/provider-dashboard')}
          sx={{ mb: 3, color: '#667eea' }}
        >
          Back to Dashboard
        </Button>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
            Service History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            All services you have provided to customers
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{allServices.length}</Typography>
                <Typography variant="body2">Total Services</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{completedServices.length}</Typography>
                <Typography variant="body2">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{pendingServices.length}</Typography>
                <Typography variant="body2">Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  ₹{completedServices.reduce((sum, s) => sum + parseInt((s.amount || '0').replace('₹', '')), 0)}
                </Typography>
                <Typography variant="body2">Total Earnings</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Card elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`All (${allServices.length})`} />
              <Tab label={`Completed (${completedServices.length})`} />
              <Tab label={`Pending (${pendingServices.length})`} />
              <Tab label={`Cancelled (${cancelledServices.length})`} />
            </Tabs>
          </Box>
        </Card>
        <Box sx={{ mt: 3 }}>
          {getCurrentServices().length > 0 ? (
            getCurrentServices().map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  No services found
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
      <Dialog open={openDetailsDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>Service Details</DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Service ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    #{selectedService.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box>
                    <Chip
                      label={selectedService.status.toUpperCase()}
                      color={getStatusColor(selectedService.status)}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Customer Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.customer}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Service Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.service}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {new Date(selectedService.date).toLocaleDateString('en-IN')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Time</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.time}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Service Location</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.address}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Customer Phone</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.customerPhone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Earnings</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                    {selectedService.amount}
                  </Typography>
                </Grid>
                {selectedService.customerRating && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Customer Rating & Review</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffa726' }}>
                        {selectedService.customerRating} ⭐
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {selectedService.customerReview}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
}

export default ProviderServiceHistory;
