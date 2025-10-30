import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, Avatar } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import ConstructionIcon from '@mui/icons-material/Construction';

function Services({ filter }) {
  const services = [
    { icon: <ElectricBoltIcon sx={{ fontSize: 60 }} />, name: 'Electrician', desc: 'Expert electrical services' },
    { icon: <PlumbingIcon sx={{ fontSize: 60 }} />, name: 'Plumber', desc: 'Professional plumbing work' },
    { icon: <FormatPaintIcon sx={{ fontSize: 60 }} />, name: 'Painter', desc: 'Quality painting services' },
    { icon: <ConstructionIcon sx={{ fontSize: 60 }} />, name: 'Labor', desc: 'Skilled construction workers' },
  ];

  // Filter logic
  const filteredServices = !filter
    ? services
    : services.filter(service =>
        service.name.toLowerCase().includes(filter.toLowerCase()) ||
        service.desc.toLowerCase().includes(filter.toLowerCase())
      );

  return (
    <Container sx={{ py: 6 }}>
      <Typography 
        variant="h3" 
        align="center" 
        sx={{ mb: 5, fontWeight: 'bold', color: '#333' }}
      >
        Our Services
      </Typography>
      <Grid container spacing={4}>
        {filteredServices.length ? (
          filteredServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ color: '#667eea', mb: 2 }}>
                  {service.icon}
                </Box>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea', mb: 1 }}>
                    {service.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {service.desc}
                  </Typography>
                  <Button 
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '25px',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography align="center" color="text.secondary" sx={{ width: '100%', mt: 4 }}>
            No services found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
export default Services;
