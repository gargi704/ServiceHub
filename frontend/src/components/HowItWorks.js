import { Container, Grid, Card, Typography, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function HowItWorks() {
  const steps = [
    { icon: <SearchIcon sx={{ fontSize: 40, color: '#4facfe' }} />, label: "Search & Choose", desc: "Find trusted service providers nearby." },
    { icon: <AddTaskIcon sx={{ fontSize: 40, color: '#f093fb' }} />, label: "Book Instantly", desc: "Pick your slot and book your service in seconds." },
    { icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#fa709a' }} />, label: "Get the Service", desc: "Sit back and relax. Provider will reach you." },
  ];
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
        How It Works
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {steps.map((step, idx) => (
          <Grid item xs={12} sm={4} key={step.label}>
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
