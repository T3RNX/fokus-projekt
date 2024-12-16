import { Box, Typography } from '@mui/material';
import React from 'react';

const Treatments = () => {
  console.log('Treatment page rendered');
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Treatments
      </Typography>
      <Typography variant="body1">
        Welcome to the Treatment Page!
      </Typography>
    </Box>
  );
};

export default Treatments;