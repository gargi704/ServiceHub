import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, TextField, Button, Avatar, IconButton, Divider, Alert } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../api.js';

function CustomerProfile() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stats, setStats] = useState({ totalBookings: 0, completedServices: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    profileImage: ''
  });


  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
        setProfileData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          pincode: res.data.pincode || '',
          city: res.data.city || '',
          state: res.data.state || '',
          profileImage: res.data.profileImage || ''
        });
        setIsEditing(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setProfileData({
            name: '', email: '', phone: '', address: '', pincode: '', city: '', state: ''
          });
          setIsEditing(true);
        } else {
          toast.error("Could not load profile!");
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings/customer/${userId}`);
        const bookings = res.data || [];
        setStats({
          totalBookings: bookings.length,
          completedServices: bookings.filter(b => b.status === 'completed').length,
          totalSpent: bookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + Number(b.amount || 0), 0)
        });
      } catch (e) {
        setStats({ totalBookings: 0, completedServices: 0, totalSpent: 0 });
      }
    }
    if (userId) fetchStats();
  }, [userId]);


  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.patch(`${API_BASE_URL}/api/users/${userId}`, profileData);
      setShowSuccess(true);
      setIsEditing(false);
      toast.success("Profile updated!");
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      toast.error("Could not update profile.");
    }
  };

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const userId = localStorage.getItem('userId');
      await axios.post(`${API_BASE_URL}/api/users/update-password`, {
        userId,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success("Password updated successfully!");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error("Failed to update password!");
    }
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('userId', userId);
    try {
      const res = await axios.post('${API_BASE_URL}/api/users/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileData(prev => ({ ...prev, profileImage: res.data.profileImage }));
      toast.success("Photo uploaded!");
    } catch {
      toast.error("Photo upload failed");
    }
  };


  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', mr: 3 }}>
                <Avatar
                  src={profileData.profileImage ? `${API_BASE_URL}${profileData.profileImage}` : undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '3rem',
                    fontWeight: 'bold'
                  }}
                >
                  {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : 'CU'}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
                <IconButton
                  onClick={handlePhotoClick}
                  sx={{
                    position: 'absolute', bottom: 0, right: 0, background: 'white', boxShadow: 2,
                    '&:hover': { background: '#f5f5f5' }
                  }}
                  size="small"
                >
                  <PhotoCameraIcon />
                </IconButton>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                  {profileData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Member since {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Typography>
              </Box>
              <Button
                variant={isEditing ? 'contained' : 'outlined'}
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={() => {
                  if (isEditing) handleSave(); else setIsEditing(true);
                }}
                sx={{
                  background: isEditing ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: isEditing ? 'white' : '#667eea',
                  '&:hover': {
                    background: isEditing ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' : 'rgba(102, 126, 234, 0.1)'
                  }
                }}
              >
                {isEditing
                  ? (profileData.name ? 'Save Changes' : 'Save Profile')
                  : 'Edit Profile'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {loading ? (
          <Typography variant="body1" color="text.secondary">Loading profile...</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                    Personal Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        name="pincode"
                        value={profileData.pincode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={profileData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        multiline
                        rows={3}
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>
                  {isEditing && (
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          px: 4
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>

              <Card elevation={3} sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                    Change Password
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      onClick={handlePasswordUpdate}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        px: 4
                      }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                    Account Statistics
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Bookings
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                      {stats.totalBookings}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Completed Services
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4facfe' }}>
                      {stats.completedServices}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Spent
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f5576c' }}>
                      ₹{stats.totalSpent}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                    Quick Actions
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    View Booking History
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    Payment Methods
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default CustomerProfile;
