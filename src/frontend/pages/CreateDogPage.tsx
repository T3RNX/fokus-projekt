import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createDog } from "../API/Dog";

const CreateDogPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    race: "",
    weight: "",
    ownerID: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const dogData = {
        name: formData.name,
        age: parseInt(formData.age, 10),
        race: formData.race,
        weight: parseFloat(formData.weight),
        ownerID: parseInt(formData.ownerID, 10),
      };
  
      await createDog(dogData);
      navigate("/dogs");
    } catch (error) {
      console.error("Error creating dog:", error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#FFFFFF",
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Hund Erstellen
      </Typography>
      <Box component="form" sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          variant="outlined"
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
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
          variant="outlined"
          label="Alter"
          name="age"
          type="number"
          fullWidth
          margin="normal"
          value={formData.age}
          onChange={handleChange}
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
          variant="outlined"
          label="Gewicht"
          name="weight"
          type="number"
          fullWidth
          margin="normal"
          value={formData.weight}
          onChange={handleChange}
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
          variant="outlined"
          label="Rasse"
          name="race"
          fullWidth
          margin="normal"
          value={formData.race}
          onChange={handleChange}
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
          variant="outlined"
          label="Besitzer ID"
          name="ownerID"
          type="number"
          fullWidth
          margin="normal"
          value={formData.ownerID}
          onChange={handleChange}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF6C3E",
              "&:hover": { backgroundColor: "#FF5722" },
            }}
            onClick={() => navigate(-1)}
          >
            Zurück
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF6C3E",
              "&:hover": { backgroundColor: "#FF5722" },
            }}
            onClick={handleSubmit}
          >
            Erstellen
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateDogPage;
