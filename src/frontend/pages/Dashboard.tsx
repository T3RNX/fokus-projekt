import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import PeopleIcon from "@mui/icons-material/People";
import HealingIcon from "@mui/icons-material/Healing";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Dashboard() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              bgcolor: "#1e1e1e",
              color: "white",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle1">Hunde</Typography>
              <PetsIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              12
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              +2 seit letztem Monat
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              bgcolor: "#1e1e1e",
              color: "white",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle1">Besitzer</Typography>
              <PeopleIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              8
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              +1 seit letztem Monat
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              bgcolor: "#1e1e1e",
              color: "white",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle1">Behandlungen</Typography>
              <HealingIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              24
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              +8 seit letztem Monat
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              bgcolor: "#1e1e1e",
              color: "white",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle1">Anstehende Termine</Typography>
              <CalendarMonthIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              5
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              Nächster Termin: Morgen
            </Typography>
          </Paper>
        </Grid>

        {/* Larger info cards */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "#1e1e1e",
              color: "white",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Letzte Besuche
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Hier werden die letzten Besuche angezeigt.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "#1e1e1e",
              color: "white",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Anstehende Behandlungen
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Hier werden anstehende Behandlungen angezeigt.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
