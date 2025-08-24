import { Box, Typography, Container } from '@mui/material';

export default function Notifications() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Notifications</Typography>
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          All notifications will be displayed here.
        </Typography>
      </Box>
    </Container>
  );
} 