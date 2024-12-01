import { Box, Typography } from '@mui/material';

const Owner = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Owner
      </Typography>
      <Typography variant="body1">
        This is the Owner page. Here you can manage the owners of the dogs.
      </Typography>
    </Box>
  );
};

export default Owner;