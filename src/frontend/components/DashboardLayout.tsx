import React from 'react';
import { Outlet } from 'react-router-dom'; // for nested routes
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon, Home, Info, Build, ContactMail } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    My Dashboard
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon><Home /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/about">
                    <ListItemIcon><Info /></ListItemIcon>
                    <ListItemText primary="About" />
                </ListItem>
                <ListItem button component={Link} to="/services">
                    <ListItemIcon><Build /></ListItemIcon>
                    <ListItemText primary="Services" />
                </ListItem>
                <ListItem button component={Link} to="/contact">
                    <ListItemIcon><ContactMail /></ListItemIcon>
                    <ListItemText primary="Contact" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                {children || <Outlet />} {/* Supports routing */}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
