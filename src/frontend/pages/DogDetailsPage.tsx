import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Container,
} from "@mui/material";
import { Dog, getDogById, deleteDog, getImageUrl } from "../API/Dog";

const DogDetailsPage = () => {
  const { dogID } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDog = async () => {
      if (!dogID) return;
      try {
        const fetchedDog = await getDogById(parseInt(dogID, 10));
        setDog(fetchedDog);
      } catch (err) {
        console.error("Error fetching dog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [dogID]);

  const handleDelete = async () => {
    if (!dogID) return;
    try {
      await deleteDog(parseInt(dogID, 10));
      navigate("/dogs");
    } catch (err) {
      console.error("Error deleting dog:", err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: "#121212", color: "white" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", mb: 3 }}>
            <img
              src={getImageUrl(dog?.imagePath)}
              alt="dog"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={dog?.name || ""}
              variant="outlined"
              sx={{
                backgroundColor: "#1E1E1E",
                borderRadius: 1,
                "& .MuiInputLabel-root": {
                  color: "#FFFFFF",
                },
                "& .MuiOutlinedInput-root": {
                  color: "#FFFFFF",
                },
              }}
            />
            <TextField
              fullWidth
              label="Alter"
              value={dog?.age || ""}
              variant="outlined"
              sx={{
                backgroundColor: "#1E1E1E",
                borderRadius: 1,
                "& .MuiInputLabel-root": {
                  color: "#FFFFFF",
                },
                "& .MuiOutlinedInput-root": {
                  color: "#FFFFFF",
                },
              }}
            />
            <TextField
              fullWidth
              label="Rasse"
              value={dog?.race || ""}
              variant="outlined"
              sx={{
                backgroundColor: "#1E1E1E",
                borderRadius: 1,
                "& .MuiInputLabel-root": {
                  color: "#FFFFFF",
                },
                "& .MuiOutlinedInput-root": {
                  color: "#FFFFFF",
                },
              }}
            />
            <TextField
              fullWidth
              label="Gewicht"
              value={dog?.weight || ""}
              variant="outlined"
              sx={{
                backgroundColor: "#1E1E1E",
                borderRadius: 1,
                "& .MuiInputLabel-root": {
                  color: "#FFFFFF",
                },
                "& .MuiOutlinedInput-root": {
                  color: "#FFFFFF",
                },
              }}
            />
            <TextField
              fullWidth
              label="Besitzer ID"
              value={dog?.ownerID || ""}
              variant="outlined"
              disabled
              sx={{
                backgroundColor: "#1E1E1E",
                borderRadius: 1,
                "& .MuiInputLabel-root": {
                  color: "#FFFFFF",
                },
                "& .MuiOutlinedInput-root": {
                  color: "#FFFFFF",
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: "#ff6c3e",
                "&:hover": { bgcolor: "#ff5722" },
                alignSelf: "flex-start",
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#ff6c3e",
                "&:hover": { bgcolor: "#ff5722" },
                alignSelf: "flex-start",
              }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Beschreibung"
            multiline
            rows={4}
            value={dog?.description || ""}
            variant="outlined"
            sx={{
              backgroundColor: "#1E1E1E",
              borderRadius: 1,
              "& .MuiInputLabel-root": {
                color: "#FFFFFF",
              },
              "& .MuiOutlinedInput-root": {
                color: "#FFFFFF",
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Behandlungen"
            multiline
            rows={4}
            variant="outlined"
            sx={{
              backgroundColor: "#1E1E1E",
              borderRadius: 1,
              "& .MuiInputLabel-root": {
                color: "#FFFFFF",
              },
              "& .MuiOutlinedInput-root": {
                color: "#FFFFFF",
              },
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "#ff6c3e",
            "&:hover": { bgcolor: "#ff5722" },
          }}
        >
          Zurück
        </Button>
      </Box>
    </Paper>
  );
};

export default DogDetailsPage;
