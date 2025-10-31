import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Tabs, Tab, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from '../api.js';  

function AdminDashboard() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    revenue: '₹0'
  });
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch users
    axios.get(`${API_BASE_URL}/api/users`)
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
    // Fetch providers
    axios.get(`${API_BASE_URL}/api/providers`)
      .then(res => setProviders(res.data))
      .catch(() => setProviders([]));
    // Fetch bookings
    axios.get(`${API_BASE_URL}/api/bookings`)
      .then(res => setBookings(res.data))
      .catch(() => setBookings([]));
  }, []);

  useEffect(() => {
    const revenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.amount || 0), 0);

    setStats({
      totalUsers: users.length,
      totalProviders: providers.length,
      totalBookings: bookings.length,
      revenue: `₹${revenue}`
    });
  }, [users, providers, bookings]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = (id, type) => {
    if (window.confirm(`Delete ${type} #${id}?`)) {
      axios.delete(`${API_BASE_URL}/api/${type.toLowerCase()}s/${id}`).then(() => window.location.reload());
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your entire platform from here
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.totalUsers}</Typography>
                    <Typography variant="body2">Total Users</Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 60, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.totalProviders}</Typography>
                    <Typography variant="body2">Total Providers</Typography>
                  </Box>
                  <WorkIcon sx={{ fontSize: 60, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.totalBookings}</Typography>
                    <Typography variant="body2">Total Bookings</Typography>
                  </Box>
                  <DashboardIcon sx={{ fontSize: 60, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.revenue}</Typography>
                    <Typography variant="body2">Total Revenue</Typography>
                  </Box>
                  <AttachMoneyIcon sx={{ fontSize: 60, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs and Tables */}
        <Card elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Users" />
              <Tab label="Providers" />
              <Tab label="Bookings" />
            </Tabs>
          </Box>
          <CardContent>
            {/* Users Table */}
            {tabValue === 0 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Join Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>#{user._id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.createdAt ? user.createdAt.slice(0, 10) : '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.status || "inactive"}
                            color={user.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary" onClick={() => handleViewDetails(user)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(user._id, 'User')}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Providers Table */}
            {tabValue === 1 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {providers.map((provider) => (
                      <TableRow key={provider._id} hover>
                        <TableCell>#{provider._id}</TableCell>
                        <TableCell>{provider.user?.name || '-'}</TableCell>
                        <TableCell>{provider.service}</TableCell>
                        <TableCell>{provider.phone}</TableCell>
                        <TableCell>{provider.rating} ⭐</TableCell>
                        <TableCell>
                          <Chip
                            label={provider.status || "pending"}
                            color={provider.status === 'approved' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary" onClick={() => handleViewDetails(provider)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(provider._id, 'Provider')}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Bookings Table */}
            {tabValue === 2 && (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Provider</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id} hover>
                        <TableCell>#{booking._id}</TableCell>
                        <TableCell>{booking.customer?.name || '-'}</TableCell>
                        <TableCell>{booking.provider?.user?.name || '-'}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.date ? booking.date.slice(0, 10) : '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#667eea' }}>
                          ₹{booking.amount}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={booking.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary" onClick={() => handleViewDetails(booking)}>
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>Details</DialogTitle>
        <DialogContent>
          {selectedItem && (<Box><pre>{JSON.stringify(selectedItem, null, 2)}</pre></Box>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
}

export default AdminDashboard;
