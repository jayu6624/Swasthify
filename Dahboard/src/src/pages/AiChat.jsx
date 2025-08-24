import { Box, Typography, Container } from '@mui/material';

export default function AiChat() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>AI Assistant</Typography>
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Chat with our AI assistant for health and fitness advice.
        </Typography>
      </Box>
    </Container>
  );
} 