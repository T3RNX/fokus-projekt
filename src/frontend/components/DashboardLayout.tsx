import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:800px)");

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex", bgcolor: "#121212", minHeight: "100vh" }}>
      {/* Sidebar (desktop) */}
      {!isMobile && (
        <Box sx={{ width: 250, flexShrink: 0 }}>
          <Sidebar />
        </Box>
      )}

      {/* Sidebar drawer (mobile) */}
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            bgcolor: "#1E1E1E",
            color: "#fff",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 250,
            bgcolor: "#1E1E1E",
            color: "#fff",
          },
        }}
      >
        <Sidebar onClickItem={toggleDrawer} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: "calc(100% - 250px)" },
          display: "flex",
          flexDirection: "column",
          marginLeft: { xs: 0, md: "250px" },
          height: "100vh",
          overflow: "auto", // this is good
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 3 },
            color: "#fff",
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
