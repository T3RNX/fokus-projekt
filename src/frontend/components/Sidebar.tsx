import {
  Box,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItem,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PetsIcon from '@mui/icons-material/Pets';
import PeopleIcon from '@mui/icons-material/People';
import HealingIcon from '@mui/icons-material/Healing';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation } from 'react-router-dom';
import React from 'react';

const Sidebar = () => {
  const location = useLocation();

  // Function to determine if a menu item is selected
  const isSelected = (path: string) => location.pathname === path;

  return (
    <Box
      sx={{
        width: 250, // Sidebar width
        height: '100vh', // Full screen height
        backgroundColor: '#1E1E1E', // Dark background color
        color: '#FFFFFF', // White text color
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          borderBottom: '1px solid #333',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1, // Space between text and icon
          }}
        >
          <PetsIcon /> bdogs
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ marginTop: 2 }}>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
          { text: 'Hunde', icon: <PetsIcon />, path: '/dogs' },
          { text: 'Besitzer', icon: <PeopleIcon />, path: '/owner' },
          { text: 'Behandlungen', icon: <HealingIcon />, path: '/treatments' },
        ].map((item) => (
          <ListItem
            key={item.text}
            component="a"
            href={item.path}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: isSelected(item.path) ? '#333' : 'transparent',
              color: '#FFFFFF',
              marginBottom: '12px', // Add spacing between items
              '&:hover': {
                backgroundColor: isSelected(item.path) ? '#333' : '#555', // Maintain selected background
              },
              transition: 'background-color 0.3s ease',
            }}
          >
            <ListItemIcon
              sx={{
                color: '#FFFFFF',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      {/* Footer Section */}
      <Box sx={{ marginTop: 'auto', paddingBottom: '16px' }}>
        <Divider sx={{ backgroundColor: '#333' }} />
        <List>
          <ListItem
            component="a"
            href="/settings"
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: isSelected('/settings') ? '#333' : 'transparent',
              color: '#FFFFFF',
              marginBottom: '12px', // Add spacing between items
              '&:hover': {
                backgroundColor: isSelected('/settings') ? '#333' : '#555', // Maintain selected background
              },
              transition: 'background-color 0.3s ease',
            }}
          >
            <ListItemIcon
              sx={{
                color: '#FFFFFF',
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
  