import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        background: '#333',
        color: 'white',
        textAlign: 'center',
        py: 3,
        mt: 5
      }}
    >
      <Typography variant="body1">
        &copy; 2025 ServiceHub. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
