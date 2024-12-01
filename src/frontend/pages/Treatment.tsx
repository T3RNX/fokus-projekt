import { Box, Typography } from '@mui/material';

const Treatment = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Treatment
      </Typography>
      <Typography variant="body1">
        This is the Treatment page. Here you can manage the treatments for the dogs.
      </Typography>
    </Box>
  );
};

export default Treatment;