import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Box, Typography, Card, CardContent, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Button, Tabs, Tab, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Tooltip, TextField, MenuItem
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [userFilter, setUserFilter] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/users`).then(res => setUsers(res.data)).catch(() => setUsers([]));
    axios.get(`${API_BASE_URL}/api/providers`).then(res => setProviders(res.data)).catch(() => setProviders([]));
    axios.get(`${API_BASE_URL}/api/bookings`).then(res => setBookings(res.data)).catch(() => setBookings([]));
  }, []);

  useEffect(() => {
    const revenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + Number(b.amount || 0), 0);
    setStats({
      totalUsers: users.length,
      totalProviders: providers.length,
      totalBookings: bookings.length,
      revenue: `₹${revenue}`
    });
  }, [users, providers, bookings]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleAction = (id, type, action) => {
    setPendingAction({ id, type, userAction: action });
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    try {
      if (pendingAction.type === "User") {
        if (pendingAction.userAction === "deactivate") {
          await axios.patch(`${API_BASE_URL}/api/users/${pendingAction.id}/status`);
          toast.success('User deactivated!');
          setUsers(users.map(u => u._id === pendingAction.id ? { ...u, status: 'inactive' } : u));
        } else if (pendingAction.userAction === "reactivate") {
          await axios.patch(`${API_BASE_URL}/api/users/${pendingAction.id}`, { status: 'active' });
          toast.success('User reactivated!');
          setUsers(users.map(u => u._id === pendingAction.id ? { ...u, status: 'active' } : u));
        }
      }
      if (pendingAction.type === "Provider") {
        await axios.delete(`${API_BASE_URL}/api/providers/${pendingAction.id}`);
        toast.success(`Provider deleted!`);
        setProviders(providers.filter(p => p._id !== pendingAction.id));
      }
      if (pendingAction.type === "Booking") {
        await axios.delete(`${API_BASE_URL}/api/bookings/${pendingAction.id}`);
        toast.success(`Booking deleted!`);
        setBookings(bookings.filter(b => b._id !== pendingAction.id));
      }
    } catch (err) {
      toast.error(`Action failed.`);
    }
    setConfirmDialogOpen(false);
    setPendingAction(null);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const filteredUsers = users.filter(user => (userFilter === '' || user.status === userFilter));

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" />
      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 3, md: 6 }, px: { xs: 0.5, sm: 2 } }}>
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Typography variant="h4" sx={{
            fontWeight: 'bold',
            color: '#333',
            mb: 1,
            fontSize: { xs: 22, sm: 28, md: 30 }
          }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 14, sm: 16 } }}>
            Manage your entire platform from here
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{
              background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
              color: 'white', borderRadius: 3, p: { xs: 1.5, md: 2 }
            }}>
              <CardContent sx={{ p: { xs: 1, md: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 18, sm: 24, md: 30 } }}>{stats.totalUsers}</Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: 13, sm: 15 } }}>Total Users</Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 38, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{
              background: 'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
              color: 'white', borderRadius: 3, p: { xs: 1.5, md: 2 }
            }}>
              <CardContent sx={{ p: { xs: 1, md: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 18, sm: 24, md: 30 } }}>{stats.totalProviders}</Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: 13, sm: 15 } }}>Total Providers</Typography>
                  </Box>
                  <WorkIcon sx={{ fontSize: 38, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{
              background: 'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
              color: 'white', borderRadius: 3, p: { xs: 1.5, md: 2 }
            }}>
              <CardContent sx={{ p: { xs: 1, md: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 18, sm: 24, md: 30 } }}>{stats.totalBookings}</Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: 13, sm: 15 } }}>Total Bookings</Typography>
                  </Box>
                  <DashboardIcon sx={{ fontSize: 38, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{
              background: 'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
              color: 'white', borderRadius: 3, p: { xs: 1.5, md: 2 }
            }}>
              <CardContent sx={{ p: { xs: 1, md: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 18, sm: 24, md: 30 } }}>{stats.revenue}</Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: 13, sm: 15 } }}>Total Revenue</Typography>
                  </Box>
                  <AttachMoneyIcon sx={{ fontSize: 38, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card elevation={3}>
          <Box sx={{
            borderBottom: 1, borderColor: 'divider',
            display: 'flex', alignItems: { xs: "stretch", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, p: 2
          }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: "36px",
                '& .MuiTab-root': { fontSize: { xs: 14, sm: 16 } }
              }}>
              <Tab label="Users" />
              <Tab label="Providers" />
              <Tab label="Bookings" />
            </Tabs>
            {tabValue === 0 && (
              <Box sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 }, width: "auto" }}>
                <TextField
                  select
                  value={userFilter}
                  onChange={e => setUserFilter(e.target.value)}
                  label="Filter by Status"
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Box>
            )}
          </Box>
          <CardContent sx={{ px: { xs: 0, sm: 2 } }}>
            {tabValue === 0 && (
              <TableContainer component={Paper} elevation={0} sx={{ width: '100%', overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Join Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id} hover sx={{ opacity: user.status === "active" ? 1 : 0.6 }}>
                        <TableCell>#{user._id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.createdAt ? user.createdAt.slice(0, 10) : '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.status}
                            color={user.status === "active" ? "success" : "default"}
                            size="small"
                            sx={{
                              textTransform: 'lowercase',
                              fontWeight: 'normal',
                              fontSize: { xs: 13, sm: 15 }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary" onClick={() => handleViewDetails(user)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {user.status === 'active' ? (
                            <Tooltip title="Deactivate User">
                              <IconButton size="small" color="warning" onClick={() => handleAction(user._id, 'User', 'deactivate')}>
                                <BlockIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Reactivate User">
                              <IconButton size="small" color="success" onClick={() => handleAction(user._id, 'User', 'reactivate')}>
                                <RestoreIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {tabValue === 1 && (
              <TableContainer component={Paper} elevation={0} sx={{ width: '100%', overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Rating</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Actions</TableCell>
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
                            sx={{ fontSize: { xs: 13, sm: 15 } }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary" onClick={() => handleViewDetails(provider)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Provider">
                            <IconButton size="small" color="error" onClick={() => handleAction(provider._id, 'Provider', 'delete')}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {tabValue === 2 && (
              <TableContainer component={Paper} elevation={0} sx={{ width: '100%', overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Provider</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: 13, sm: 15 } }}>Actions</TableCell>
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
                        <TableCell sx={{ fontWeight: 'bold', color: '#667eea', fontSize: { xs: 13, sm: 15 } }}>
                          ₹{booking.amount}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={booking.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                            sx={{ fontSize: { xs: 13, sm: 15 } }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary" onClick={() => handleViewDetails(booking)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Booking">
                            <IconButton size="small" color="error" onClick={() => handleAction(booking._id, 'Booking', 'delete')}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>Details</DialogTitle>
          <DialogContent>
            {selectedItem && (<Box><pre style={{ fontSize: 14 }}>{JSON.stringify(selectedItem, null, 2)}</pre></Box>)}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog for action */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
          <DialogTitle>
            {pendingAction?.type === "User" && pendingAction?.userAction === "deactivate" && "Deactivate User"}
            {pendingAction?.type === "User" && pendingAction?.userAction === "reactivate" && "Reactivate User"}
            {pendingAction?.type !== "User" && "Delete"}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
              {pendingAction?.type === "User" && pendingAction?.userAction === "deactivate" &&
                "Are you sure you want to deactivate this user? User will lose all access but data will be preserved."
              }
              {pendingAction?.type === "User" && pendingAction?.userAction === "reactivate" &&
                "Are you sure to reactivate this user? User will get platform access again."
              }
              {pendingAction?.type !== "User" &&
                `Delete ${pendingAction?.type} #${pendingAction?.id}? This action cannot be undone.`
              }
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmAction} variant="contained"
              color={pendingAction?.type === "User" && pendingAction?.userAction === "reactivate" ? "success" : "error"}>
              {pendingAction?.type === "User" && pendingAction?.userAction === "reactivate"
                ? "Reactivate"
                : pendingAction?.type === "User" && pendingAction?.userAction === "deactivate"
                  ? "Deactivate"
                  : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
        <Footer />
      </Container>
    </>
  );
}

export default AdminDashboard;
