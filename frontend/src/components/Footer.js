import React from 'react';
import { Box, Typography, Link as MuiLink, Stack } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslation } from 'react-i18next';


function Footer() {
  const { t } = useTranslation();
  return (
    <Box sx={{
      background: '#333', color: 'white', textAlign: 'center',
      py: { xs: 2.5, sm: 4 }, mt: 6
    }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1.5, sm: 3 }}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          mb: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
          <PhoneIcon fontSize="small" />
          <MuiLink
            href="https://wa.me/918601860318"
            color="inherit"
            underline="always"
            target="_blank"
            rel="noopener"
            sx={{ fontWeight: 600, fontSize: { xs: 15, sm: 16 } }}
          >
            +91 8601860318
            <WhatsAppIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
          </MuiLink>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
          <EmailIcon fontSize="small" />
          <MuiLink
            href="mailto:2023aspire194@gmail.com?subject=Need%20Help&body=Describe%20your%20query%20here."
            color="inherit"
            underline="always"
            sx={{ fontWeight: 600, fontSize: { xs: 15, sm: 16 } }}
          >
            2023aspire194@gmail.com
          </MuiLink>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
          <HelpOutlineIcon fontSize="small" />
          <MuiLink
            href="/help"
            color="inherit"
            underline="always"
            sx={{ fontWeight: 600, fontSize: { xs: 15, sm: 16 } }}
          >
           {t('needHelp')}
          </MuiLink>
        </Box>
      </Stack>
      <Typography variant="body2" sx={{ mt: 1, fontSize: { xs: 13, sm: 15 } }}>
        &copy; {new Date().getFullYear()} ServiceHub.{t('allRightsReserved')}
      </Typography>
    </Box>
  );
}

export default Footer;
