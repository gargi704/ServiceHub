import { Container, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import LockIcon from '@mui/icons-material/Lock';

function WhyChooseUs() {
  const items = [
    { icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#667eea' }} />, label: "Verified Providers", desc: "All professionals are background checked and trusted." },
    { icon: <ScheduleSendIcon sx={{ fontSize: 40, color: '#667eea' }} />, label: "Quick Booking", desc: "Book in seconds, get service at your convenience." },
    { icon: <LockIcon sx={{ fontSize: 40, color: '#667eea' }} />, label: "Secure Payments", desc: "100% safe, encrypted transactions." },
    { icon: <MoneyOffIcon sx={{ fontSize: 40, color: '#667eea' }} />, label: "Transparent Pricing", desc: "No hidden charges. Get quotes instantly." },
  ];
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
        Why Choose ServiceHub?
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {items.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Card sx={{ textAlign: 'center', p: 2, borderRadius: 3, boxShadow: 3 }}>
              <Box>{item.icon}</Box>
              <CardContent>
                <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>{item.label}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 15 }}>
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
export default WhyChooseUs;
