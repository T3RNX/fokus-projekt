import {
  Box,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItem,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PetsIcon from "@mui/icons-material/Pets";
import PeopleIcon from "@mui/icons-material/People";
import HealingIcon from "@mui/icons-material/Healing";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation, Link } from "react-router-dom";
import React from "react";

interface SidebarProps {
  onClickItem?: () => void; // only used in mobile mode
}

const Sidebar: React.FC<SidebarProps> = ({ onClickItem }) => {
  const location = useLocation();

  const isSelected = (path: string) => location.pathname === path;

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Hunde", icon: <PetsIcon />, path: "/dogs" },
    { text: "Besitzer", icon: <PeopleIcon />, path: "/owner" },
    { text: "Behandlungen", icon: <HealingIcon />, path: "/treatments" },
  ];

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        backgroundColor: "#1E1E1E",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          borderBottom: "1px solid #333",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PetsIcon /> bdogs
        </Typography>
      </Box>

      <List sx={{ mt: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={onClickItem}
              sx={{
                borderRadius: "8px",
                backgroundColor: isSelected(item.path) ? "#333" : "transparent",
                color: "#FFFFFF",
                mb: 1,
                mx: 1,
                "&:hover": {
                  backgroundColor: isSelected(item.path) ? "#333" : "#555",
                },
                transition: "background-color 0.3s ease",
              }}
            >
              <ListItemIcon sx={{ color: "#FFFFFF" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer Section */}
      <Box sx={{ mt: "auto", pb: 2 }}>
        <Divider sx={{ backgroundColor: "#333" }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/settings"
              onClick={onClickItem}
              sx={{
                borderRadius: "8px",
                backgroundColor: isSelected("/settings")
                  ? "#333"
                  : "transparent",
                color: "#FFFFFF",
                mt: 1,
                mx: 1,
                "&:hover": {
                  backgroundColor: isSelected("/settings") ? "#333" : "#555",
                },
                transition: "background-color 0.3s ease",
              }}
            >
              <ListItemIcon sx={{ color: "#FFFFFF" }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
