import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderDashboard from './pages/ProviderDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CustomerProfile from './pages/CustomerProfile';
import ProviderProfile from './pages/ProviderProfile';
import ReviewsRatings from './pages/ReviewsRatings';
import BookingHistory from './pages/BookingHistory';
import ProviderServiceHistory from './pages/ProviderServiceHistory';



const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/provider-profile" element={<ProviderProfile />} />
          <Route path="/reviews/:providerId" element={<ReviewsRatings />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/provider-service-history" element={<ProviderServiceHistory />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
