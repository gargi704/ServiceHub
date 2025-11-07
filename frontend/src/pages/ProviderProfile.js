import React, { useState, useEffect, useRef } from 'react';
import { Container, Grid, Box, Card, CardContent, TextField, Button, Typography, Avatar, Chip, Alert, Rating } from '@mui/material';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { IMAGE_SERVER } from '../api';

function ProviderProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  // console.log("ProviderProfile loaded. userId in localStorage =", userId);
  const emptyUser = { name: '' };
  const defaultProfile = {
    _id: "",
    user: emptyUser,
    service: '',
    experience: '',
    hourlyRate: '',
    skills: '',
    description: '',
    location: '',
    profileImage: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    totalJobs: 0,
    completedJobs: 0,
    earnings: 0,
    rating: 0,
  };
  const [profile, setProfile] = useState(defaultProfile);
  const [loaded, setLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();
  const [reviewStats, setReviewStats] = useState({ total: 0, average: 0 });


  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_BASE_URL}/api/providers/by-user/${userId}`)
      .then(res => {
        if (res.data && res.data._id) {
          setProfile({
            ...defaultProfile,
            ...res.data,
            user: res.data.user || emptyUser
          });
          setIsEditing(false);
          // fetch reviews for this provider
          axios.get(`${API_BASE_URL}/api/reviews/${res.data._id}`)
            .then(rev => {
              setReviewStats({
                total: rev.data.total || 0,
                average: Number(rev.data.average) || 0
              });
            })
            .catch(() => {
              setReviewStats({ total: 0, average: 0 });
            });
        } else {
          setProfile(defaultProfile);
          setIsEditing(true);
        }
        setLoaded(true);
      })
      .catch(() => {
        setProfile(defaultProfile);
        setIsEditing(true);
        setLoaded(true);
      });
  }, [userId, navigate]);

  // const handleUpload = (type) => async (e) => {
  //   const files = e.target.files;
  //   if (!files.length) return;
  //   const formData = new FormData();
  //   Array.from(files).forEach(file => formData.append('files', file));
  //   formData.append('userId', userId);
  //   formData.append('type', type);
  //   try {
  //     await axios.post(`${API_BASE_URL}/api/providers/upload-files`, formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });
  //     toast.success("File(s) uploaded successfully!");
  //   } catch {
  //     toast.error("Upload failed");
  //   }
  // };

  const handlePhotoClick = () => fileInputRef.current.click();

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('userId', userId);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/providers/upload-photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, profileImage: res.data.profileImage }));
      setPreview(URL.createObjectURL(file));

      // Fresh profile load karo
      const freshRes = await axios.get(`${API_BASE_URL}/api/providers/by-user/${userId}`);
      if (freshRes.data && freshRes.data._id) {
        setProfile(prev => ({ ...prev, ...freshRes.data }));
      }
      toast.success("Photo uploaded successfully!");
    } catch {
      toast.error("Photo upload failed");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setProfile(prev => ({
      ...prev,
      user: { ...prev.user, name: value }
    }));
  };

  const handleSave = async () => {
    if (!userId || userId === "undefined" || userId === "null" || userId.trim() === "") {
      toast.error("User ID missing! Please login again.");
      window.location.href = "/login";
      return;
    }

    try {
      // 1. Save provider's basic info (user: userId, not an object)
      const providerData = {
        ...profile,
        user: userId,
      };
      await axios.post(`${API_BASE_URL}/api/providers`, providerData);

      // 2. Save name in main User table
      await axios.patch(`${API_BASE_URL}/api/users/${userId}`, { name: profile.user.name });

      // 3. REFRESH the loaded profile to get the new name instantly
      const updated = await axios.get(`${API_BASE_URL}/api/providers/by-user/${userId}`);
      if (updated.data && updated.data._id) {
        setProfile({
          ...defaultProfile,
          ...updated.data,
          user: updated.data.user || emptyUser,
        });
      }

      setShowSuccess(true);
      setIsEditing(false);
    } catch (error) {
      toast.error('Save failed: ' + (error.response?.data?.error || error.message));
    }
  };

  if (!loaded) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {showSuccess && <Alert severity="success" sx={{ mb: 3 }}>Profile saved successfully!</Alert>}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative', minWidth: 120, minHeight: 120, display: 'inline-block', mr: 3 }}>
                <Avatar
                  src={(preview || profile.profileImage) ? `${IMAGE_SERVER}${preview || profile.profileImage}` : undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    border: '2px solid #eee'
                  }}
                >
                  {(!profile.profileImage && !preview) && (profile.user?.name ? profile.user.name.split(' ').map(n => n[0]).join('') : 'P')}
                </Avatar>

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                />
                <IconButton
                  onClick={handlePhotoClick}
                  sx={{
                    position: 'absolute',
                    right: 8, bottom: 8, bgcolor: 'white',
                    border: '1px solid #eee', p: 0.7, boxShadow: 1,
                    "&:hover": { bgcolor: '#e0e7ff' }, zIndex: 2
                  }}
                  size="small"
                  component="span"
                  title="Upload Profile Photo"
                >
                  <CameraAltIcon sx={{ color: "#667eea", fontSize: 22 }} />
                </IconButton>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mr: 2 }}>{profile.user?.name || 'Provider'}</Typography>
                  <Chip icon={<VerifiedIcon />} label="Verified" color="success" size="small" />
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {profile.service || 'Service'} • {profile.experience ? `${profile.experience}+ years experience` : ''}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={reviewStats.average || 0} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    ({reviewStats.average} from {reviewStats.total} reviews)
                  </Typography>
                </Box>
              </Box>
              <Button
                variant={isEditing ? 'contained' : 'outlined'}
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                sx={{
                  background: isEditing ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: isEditing ? 'white' : '#667eea', px: 4
                }}
              >{isEditing ? 'Save Profile' : 'Edit Profile'}</Button>
            </Box>
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          {/* Professional Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                  Professional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      name="name"
                      fullWidth
                      value={profile.user?.name || ""}
                      disabled={!isEditing}
                      onChange={handleUserNameChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Service Type"
                      name="service"
                      fullWidth
                      value={profile.service || ""}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Years of Experience"
                      name="experience"
                      fullWidth
                      value={profile.experience || ""}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Hourly Rate (₹)"
                      name="hourlyRate"
                      fullWidth
                      value={profile.hourlyRate || ""}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Skills"
                      name="skills"
                      fullWidth
                      value={profile.skills || ""}
                      disabled={!isEditing}
                      helperText="Comma-separated skills"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="About Me"
                      name="description"
                      fullWidth
                      multiline
                      rows={3}
                      value={profile.description || ""}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>Contact Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      name="email"
                      fullWidth
                      value={profile.email || ""}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phone"
                      fullWidth
                      value={profile.phone || ""}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      name="city"
                      fullWidth
                      value={profile.city || ""}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="State"
                      name="state"
                      fullWidth
                      value={profile.state || ""}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      name="address"
                      fullWidth
                      value={profile.address || ""}
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Performance Stats */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                  Performance Stats
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Total Jobs</Typography>
                    <TextField
                      name="totalJobs"
                      variant="standard"
                      fullWidth
                      value={profile.totalJobs || 0}
                      disabled={!isEditing}
                      onChange={handleChange}
                      inputProps={{ type: 'number', min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Completed</Typography>
                    <TextField
                      name="completedJobs"
                      variant="standard"
                      fullWidth
                      value={profile.completedJobs || 0}
                      disabled={!isEditing}
                      onChange={handleChange}
                      inputProps={{ type: 'number', min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Total Earnings</Typography>
                    <TextField
                      name="earnings"
                      variant="standard"
                      fullWidth
                      value={profile.earnings || 0}
                      disabled={!isEditing}
                      onChange={handleChange}
                      inputProps={{ type: 'number', min: 0 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>Quick Actions</Typography>
                <Button
                  fullWidth variant="outlined" sx={{ mb: 2, bgcolor: "#e9efff" }}
                  onClick={() => navigate(`/reviews/${profile._id}`)}
                  disabled={!profile._id}
                >VIEW YOUR REVIEWS</Button>
                {/* <Button fullWidth variant="outlined" sx={{ mb: 2 }} component="label">
                  UPLOAD ID PROOF
                  <input hidden type="file" accept="image/*" onChange={handleUpload('idProof')} />
                </Button>
                <Button fullWidth variant="outlined" sx={{ mb: 2 }} component="label">
                  UPLOAD CERTIFICATES
                  <input hidden type="file" accept="image/*" multiple onChange={handleUpload('certificates')} />
                </Button>
                <Button fullWidth variant="outlined" component="label">
                  UPLOAD WORK PHOTOS
                  <input hidden type="file" accept="image/*" multiple onChange={handleUpload('workPhotos')} />
                </Button> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ProviderProfile;
