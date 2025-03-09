import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createDog, CreateDogDTO } from "../API/Dog";

interface FormValues {
  name: string;
  age: string;
  race: string;
  weight: string;
  ownerID: string;
}

const CreateDogPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    age: "",
    race: "",
    weight: "",
    ownerID: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("age", formValues.age);
      formData.append("race", formValues.race);
      formData.append("weight", formValues.weight);
      formData.append("ownerID", formValues.ownerID);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await createDog(formData);
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
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button component="span" variant="contained" sx={{ mt: 2, mb: 2 }}>
          Upload Image
        </Button>
      </label>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            marginBottom: "20px",
          }}
        />
      )}
      <Box component="form" sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          variant="outlined"
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={formValues.name}
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
          value={formValues.age}
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
          value={formValues.race}
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
          value={formValues.weight}
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
          value={formValues.ownerID}
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