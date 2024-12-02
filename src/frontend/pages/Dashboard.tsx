import { Box, Typography } from '@mui/material';


const Dashboard = () => {
  console.log('Dashboard page rendered');
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to the Dashboard Page!
      </Typography>
    </Box>
  );
};

export default Dashboard;