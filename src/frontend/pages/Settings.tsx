import { Box, Typography } from '@mui/material';
import React from 'react';


const Settings = () => {
  console.log('Settings page rendered');
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1">
        Welcome to the Settings Page!
      </Typography>
    </Box>
  );
};

export default Settings;