import React from 'react';
import { Container, Grid, Card, Typography, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useTranslation } from 'react-i18next';

function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { icon: <SearchIcon sx={{ fontSize: 40, color: '#4facfe' }} />, label: t('searchChoose'), desc: t('findTrustedProviders') },
    { icon: <AddTaskIcon sx={{ fontSize: 40, color: '#f093fb' }} />, label: t('bookInstantly'), desc: t('pickSlot') },
    { icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#fa709a' }} />, label: t('getService'), desc: t('providerWillReach') },
  ];
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
        {t('howItWorks')}
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {steps.map((step, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{ textAlign: 'center', py: 4, borderRadius: 2, boxShadow: 2 }}>
              <Box>{step.icon}</Box>
              <Typography sx={{ fontWeight: 700, mt: 2 }}>{step.label}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1, fontSize: 14 }}>
                {step.desc}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HowItWorks;
