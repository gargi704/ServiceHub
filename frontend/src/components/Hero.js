import React from 'react';
import { Box, Typography, TextField, Button, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Hero({searchQuery, setSearchQuery}) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}
    >
      <Container maxWidth="md">
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            animation: 'fadeInDown 1s'
          }}
        >
          Find Trusted Workers Near You
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, animation: 'fadeInUp 1s' }}>
          Electricians, Plumbers, Laborers & More
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, animation: 'fadeIn 1.5s' }}>
          <TextField
            fullWidth
            autoFocus   
            variant="outlined"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              background: 'white',
              borderRadius: '25px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
              }
            }}
          />
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            sx={{
              background: '#ffd700',
              color: '#333',
              borderRadius: '25px',
              px: 4,
              fontWeight: 'bold',
              '&:hover': {
                background: '#ffed4e',
                transform: 'scale(1.05)'
              }
            }}
          >
            Search
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Hero;
