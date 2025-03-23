import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, Grid } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { Dog, getDogById, deleteDog, getImageUrl } from "../API/Dog";

const DogDetailsPage = () => {
  const { dogID } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");

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

  useEffect(() => {
    if (dog?.description) {
      setDescription(dog.description);
    }
  }, [dog]);

  const handleSaveDescription = async () => {
    try {
      const response = await fetch(
        `https://localhost:7202/Dog/${dogID}/description`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description }),
        }
      );

      if (!response.ok) throw new Error("Failed to update description");

      setDog((prev) => (prev ? { ...prev, description } : null));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

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
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#121212",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "#fff",
        p: 4,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Top Section: Image (left), Fields (right), Edit button in top-right */}
        <Grid container spacing={2}>
          {/* Image on the left with fixed width & height */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                width: 350,
                height: 250,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#2c2c2c",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {dog?.dogID ? (
                <img
                  src={getImageUrl(dog.dogID)}
                  alt={dog.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = "none";
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#666",
                  }}
                >
                  <PetsIcon sx={{ fontSize: 60 }} />
                  <Typography>Kein Bild vorhanden</Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Fields on the right + Edit button top-right */}
          <Grid item xs={6} md={8}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#ff6c3e",
                  "&:hover": { bgcolor: "#ff5722" },
                  fontWeight: "bold",
                }}
              >
                EDIT
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Name"
                  value={dog?.name || ""}
                  disabled
                  fullWidth
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Alter"
                  value={dog?.age || ""}
                  disabled
                  fullWidth
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Rasse"
                  value={dog?.race || ""}
                  disabled
                  fullWidth
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Gewicht"
                  value={dog?.weight || ""}
                  disabled
                  fullWidth
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Besitzer"
                  value={dog?.ownerID || ""}
                  disabled
                  fullWidth
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Middle Section: Description & Treatments stacked */}
        <Box>
          <TextField
            label="Beschreibung"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (!isEditing) {
                setIsEditing(true);
              }
            }}
            onClick={() => {
              if (!isEditing) {
                setIsEditing(true);
              }
            }}
            fullWidth
            multiline
            rows={4}
            sx={{
              ...textFieldStyle,
              "& .MuiOutlinedInput-root": {
                ...textFieldStyle["& .MuiOutlinedInput-root"],
                cursor: "text",
              },
            }}
          />
          {isEditing && (
            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
              <Button
                onClick={handleSaveDescription}
                variant="contained"
                sx={{
                  bgcolor: "#ff6c3e",
                  "&:hover": { bgcolor: "#ff5722" },
                  "&.Mui-disabled": {
                    color: "#ffffff",
                    opacity: 0.7,
                    bgcolor: "#ff6c3e",
                  },
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
                disabled={description === dog?.description}
              >
                Speichern
              </Button>
              <Button
                onClick={() => {
                  setDescription(dog?.description || "");
                  setIsEditing(false);
                }}
                variant="contained"
                sx={{
                  bgcolor: "#2c2c2c",
                  "&:hover": { bgcolor: "#444" },
                }}
              >
                Abbrechen
              </Button>
            </Box>
          )}
        </Box>
        <Box>
          <TextField
            label="Behandlungen"
            value={""}
            disabled
            fullWidth
            multiline
            rows={4}
            sx={textFieldStyle}
          />
        </Box>

        {/* Bottom: Back button (left) & optionally Delete button if you want it */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#ff6c3e",
              "&:hover": { bgcolor: "#ff5722" },
              fontWeight: "bold",
            }}
          >
            ZURÜCK
          </Button>
          {/* Uncomment if you'd like a Delete button at the bottom */}
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ fontWeight: "bold" }}
          >
            DELETE
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Shared styling for read-only TextFields
const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#2c2c2c",
    color: "#fff",
    borderRadius: 1,
    "& fieldset": {
      // Add this to target the outline
      borderColor: "#444",
    },
    "&.Mui-disabled": {
      // Combine disabled styles
      color: "#fff",
      WebkitTextFillColor: "#fff",
      "& fieldset": {
        borderColor: "#444",
      },
    },
    "& input": {
      // Target the input directly
      color: "#fff",
      "&.Mui-disabled": {
        WebkitTextFillColor: "#fff",
        color: "#fff",
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
    "&.Mui-disabled": {
      color: "#fff",
    },
  },
};

export default DogDetailsPage;
