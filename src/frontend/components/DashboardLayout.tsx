import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';

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
          ml: '50px', 
          width: `calc(100% - 200px)`,
          minHeight: '100vh',
          backgroundColor: '#121212',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
