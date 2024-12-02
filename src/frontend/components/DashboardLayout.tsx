import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 2,
          ml: '250px', // Match sidebar width
          width: `calc(100% - 250px)`, // Adjust for sidebar
          minHeight: '100vh',
          backgroundColor: '#121212'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;