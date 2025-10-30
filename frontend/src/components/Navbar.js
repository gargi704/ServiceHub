import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

function Navbar({ scrollToServices }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleServicesClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToServices();
    } else {
      window.location.href = '/#services';
      setTimeout(() => {
        scrollToServices();
      }, 100);
    }
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Toolbar>
        <HomeRepairServiceIcon sx={{ mr: 2, fontSize: 30 }} />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          ServiceHub
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" onClick={handleServicesClick}>Services</Button>
          {isLoggedIn && (userRole === "customer" || userRole === "admin") && (
            <Button color="inherit" component={Link} to="/customer-dashboard">Customer</Button>
          )}
          {isLoggedIn && (userRole === "provider" || userRole === "admin") && (
            <Button color="inherit" component={Link} to="/provider-dashboard">Provider</Button>
          )}
          {isLoggedIn && userRole === "admin" && (
            <Button color="inherit" component={Link} to="/admin-dashboard">Admin</Button>
          )}
          {!isLoggedIn && (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  ml: 2,
                  background: 'white',
                  color: '#667eea',
                  '&:hover': { background: '#ffd700', color: '#667eea' }
                }}
              >
                Register
              </Button>
            </>
          )}
          {isLoggedIn && (
            <Button color="inherit"
              // sx={{ ml: 2, fontWeight: 600, fontSize: 15, borderRadius: 2, letterSpacing: 0.5 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
