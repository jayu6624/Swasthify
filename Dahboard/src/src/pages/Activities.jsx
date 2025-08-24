import { Box, Typography, Container } from '@mui/material';

export default function Activities() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Activities</Typography>
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Activity tracking features will be available here.
        </Typography>
      </Box>
    </Container>
  );
} 