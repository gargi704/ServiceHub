import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { Select, MenuItem } from '@mui/material';
// import LanguageIcon from '@mui/icons-material/Language';

function Navbar({ scrollToServices }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  const { t, i18n } = useTranslation();

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

  // Drawer menu structure
  const menuItems = [
    { text: "Home", to: "/" },
    { text: "Services", onClick: handleServicesClick },
    ...(isLoggedIn && (userRole === "customer" || userRole === "admin")
      ? [{ text: "Customer", to: "/customer-dashboard" }]
      : []),
    ...(isLoggedIn && (userRole === "provider" || userRole === "admin")
      ? [{ text: "Provider", to: "/provider-dashboard" }]
      : []),
    ...(isLoggedIn && userRole === "admin"
      ? [{ text: "Admin", to: "/admin-dashboard" }]
      : []),
    ...(!isLoggedIn
      ? [
        { text: "Login", to: "/login" },
        { text: "Register", to: "/register", contained: true }
      ]
      : [
        { text: "Logout", onClick: handleLogout }
      ])
  ];

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          {/* Mobile menu icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { md: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <HomeRepairServiceIcon sx={{ mr: 2, fontSize: 30 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ServiceHub
          </Typography>
          {/* Desktop menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: 'center', gap: 1 }}>
            <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 600 }}>{t('home')}</Button>
            <Button color="inherit" onClick={handleServicesClick} sx={{ fontWeight: 600 }}>{t('services')}</Button>
            {isLoggedIn && (userRole === "customer" || userRole === "admin") && (
              <Button color="inherit" component={Link} to="/customer-dashboard" sx={{ fontWeight: 600 }}>{t('customer')}</Button>
            )}
            {isLoggedIn && (userRole === "provider" || userRole === "admin") && (
              <Button color="inherit" component={Link} to="/provider-dashboard" sx={{ fontWeight: 600 }}>{t('provider')}</Button>
            )}
            {isLoggedIn && userRole === "admin" && (
              <Button color="inherit" component={Link} to="/admin-dashboard" sx={{ fontWeight: 600 }}>{t('admin')}</Button>
            )}
            {!isLoggedIn && (
              <>
                <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 600 }}>{t('login')}</Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    ml: 2, background: 'white', color: '#667eea',
                    fontWeight: 700,
                    '&:hover': { background: '#ffd700', color: '#667eea' }
                  }}
                >
                  Register
                </Button>
              </>
            )}
            {isLoggedIn && (
              <Button color="inherit" onClick={handleLogout} sx={{ fontWeight: 600 }}>{t('logout')}</Button>
            )}
            <Box sx={{ ml: 2 }}>
              <Button color="inherit" size="small" onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}>
                {i18n.language === 'en' ? 'हिंदी' : 'EN'}
              </Button>
            </Box>

          </Box>
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { md: "none" }
        }}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setMobileOpen(false)}>
          <List>
            {menuItems.map((item, idx) =>
              item.to ? (
                <ListItem button key={idx} component={Link} to={item.to}>
                  <ListItemText primary={item.text} />
                </ListItem>
              ) : (
                <ListItem button key={idx} onClick={item.onClick}>
                  <ListItemText primary={item.text} />
                </ListItem>
              )
            )}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
