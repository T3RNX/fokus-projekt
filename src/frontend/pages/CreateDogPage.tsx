import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateDogPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    breed: "",
    weight: "",
    owner: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const existingDogs = JSON.parse(localStorage.getItem('dogs') || '[]');
    
    const newDogs = [...existingDogs, formData];
    
    localStorage.setItem('dogs', JSON.stringify(newDogs));
    
    console.log("New Dog Data:", formData);
    navigate("/dogs");
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
            '& .MuiInputLabel-root': {
              color: '#FFFFFF'
            },
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF'
            }
          }}
        />
        <TextField
          variant="outlined"
          label="Alter"
          name="age"
          fullWidth
          margin="normal"
          value={formData.age}
          onChange={handleChange}
          sx={{
            backgroundColor: "#1E1E1E",
            borderRadius: 1,
            '& .MuiInputLabel-root': {
              color: '#FFFFFF'
            },
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF'
            }
          }}
        />
        <TextField
          variant="outlined"
          label="Gewicht"
          name="weight"
          fullWidth
          margin="normal"
          value={formData.weight}
          onChange={handleChange}
          sx={{
            backgroundColor: "#1E1E1E",
            borderRadius: 1,
            '& .MuiInputLabel-root': {
              color: '#FFFFFF'
            },
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF'
            }
          }}
        />
        <TextField
          variant="outlined"
          label="Besitzer"
          name="owner"
          fullWidth
          margin="normal"
          value={formData.owner}
          onChange={handleChange}
          sx={{
            backgroundColor: "#1E1E1E",
            borderRadius: 1,
            '& .MuiInputLabel-root': {
              color: '#FFFFFF'
            },
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF'
            }
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
