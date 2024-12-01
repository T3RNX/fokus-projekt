import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3, // Padding around the main content
          height: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;