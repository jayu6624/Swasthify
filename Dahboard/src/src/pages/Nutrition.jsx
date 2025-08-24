import { Box, Typography, Container } from '@mui/material';

export default function Nutrition() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Nutrition</Typography>
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Nutrition tracking features will be available here.
        </Typography>
      </Box>
    </Container>
  );
} 
