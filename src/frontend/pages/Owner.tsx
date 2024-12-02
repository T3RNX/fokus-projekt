import { Box, Typography } from '@mui/material';


const Owner = () => {
  console.log('Owner page rendered');
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Owner
      </Typography>
      <Typography variant="body1">
        Welcome to the Owner Page!
      </Typography>
    </Box>
  );
};

export default Owner;