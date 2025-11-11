import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Grid, Chip, Button, Tabs, Tab, Avatar, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { API_BASE_URL } from '../api.js';
import { useTranslation } from 'react-i18next';


function ProviderServiceHistory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    const providerId = localStorage.getItem('providerId');
    if (!providerId) return;
    axios.get(`${API_BASE_URL}/api/bookings/provider/${providerId}`)
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

  // Minimal info in summary card, full in dialog!
  const ServiceCard = ({ service }) => (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        transition: 'all 0.3s',
        '&:hover': { boxShadow: 6 },
        mx: { xs: 0, sm: 1 }
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={10}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: { xs: 20, sm: 28 }
                }}
              >
                {service.customer.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: 17, md: 20 } }}>
                  {service.customer}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 13, md: 15 } }}>
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
                    {t('serviceId')}: #{service.id}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<VisibilityIcon />}
              onClick={() => handleViewDetails(service)}
              sx={{ fontSize: { xs: 13, md: 16 } }}
            >
              {t('viewDetails')}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 4, md: 6 }, px: { xs: 1, md: 3 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/provider-dashboard')}
          sx={{ mb: { xs: 2, md: 3 }, color: '#667eea', fontSize: { xs: 14, md: 16 } }}
        >
          {t('backToDashboard')}
        </Button>
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1, fontSize: { xs: 23, md: 32 } }}>
            {t('serviceHistory')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 14, md: 16 } }}>
            {t('allServicesYouHaveProvided')}
          </Typography>
        </Box>
        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: { xs: 2, md: 4 } }}>
          <Grid item xs={6} sm={3}>
            <Card elevation={2}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', minHeight: 98 }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: { xs: 25, md: 32 } }}>{allServices.length}</Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: 13, md: 16 } }}>{t('totalServices')}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card elevation={2}
              sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', minHeight: 98 }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: { xs: 25, md: 32 } }}>{completedServices.length}</Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: 13, md: 16 } }}>{t('completed')}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card elevation={2}
              sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', minHeight: 98 }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: { xs: 25, md: 32 } }}>{pendingServices.length}</Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: 13, md: 16 } }}>{t('pending')}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card elevation={2}
              sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', minHeight: 98 }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: { xs: 25, md: 32 } }}>
                  ₹{completedServices.reduce((sum, s) => sum + parseInt((s.amount || '0').replace('₹', '')), 0)}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: 13, md: 16 } }}>{t('totalEarnings')}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* TABS */}
        <Card elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="Service tabs"
            >
              <Tab label={`${t('all')} (${allServices.length})`} />
              <Tab label={`${t('completed')} (${completedServices.length})`} />
              <Tab label={`${t('pending')} (${pendingServices.length})`} />
              <Tab label={`${t('cancelled')} (${cancelledServices.length})`} />
            </Tabs>
          </Box>
        </Card>

        {/* Responsive List */}
        <Box sx={{ mt: { xs: 2, md: 3 } }}>
          {getCurrentServices().length > 0 ? (
            <Grid container spacing={2}>
              {getCurrentServices().map((service) => (
                <Grid item xs={12} sm={12} md={6} key={service.id}>
                  <ServiceCard service={service} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: { xs: 2, md: 6 } }}>
                <Typography variant="h6" color="text.secondary">
                 {t('noServicesFound')}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>

      {/* Responsive Dialog: Full Details as before */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            mx: { xs: 1, sm: 2 },
            my: { xs: 2, sm: 6 },
            px: { xs: 1, sm: 2, md: 4 },
            py: { xs: 1, sm: 2 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: "1.1rem", md: "1.5rem" } }}>
         {t('serviceDetails')}
        </DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">{t('serviceId')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    #{selectedService.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">{t('status')}</Typography>
                  <Box>
                    <Chip
                      label={selectedService.status.toUpperCase()}
                      color={getStatusColor(selectedService.status)}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ my: { xs: 0.5, md: 1 } }}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">{t('customerName')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.customer}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">{t('serviceType')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.service}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">{t('date')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {new Date(selectedService.date).toLocaleDateString('en-IN')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">{t('time')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.time}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">{t('serviceLocation')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.address}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">{t('customerPhone')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedService.customerPhone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ my: { xs: 0.5, md: 1 } }}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">{t('earnings')}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea', fontSize: { xs: 18, md: 22 } }}>
                    {selectedService.amount}
                  </Typography>
                </Grid>
                {selectedService.customerRating && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Customer Rating & Review</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffa726', fontSize: { xs: 15, md: 20 } }}>
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
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
}

export default ProviderServiceHistory;
