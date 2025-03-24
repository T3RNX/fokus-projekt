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
  const [errorMessage, setErrorMessage] = useState("");
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
      setErrorMessage("");

      const formData = new FormData();
      formData.append("Name", formValues.name);
      formData.append("Age", formValues.age);
      formData.append("Race", formValues.race);
      formData.append("Weight", formValues.weight);
      formData.append("OwnerID", formValues.ownerID);

      if (selectedImage) {
        if (selectedImage.size > 2 * 1024 * 1024) {
          // 2MB in bytes
          setErrorMessage("Bild ist zu gross. Maximale Grösse beträgt 2MB.");
          return;
        }
        formData.append("image", selectedImage);
      }

      const response = await createDog(formData);
      if (response) {
        setSuccessMessage("Dog created successfully!");
        navigate("/dogs");
      }
    } catch (error: any) {
      console.error("Error creating dog:", error);
      setErrorMessage(error.message || "Fehler beim Erstellen des Hundes");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#121212",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "20px 24px",
          backgroundColor: "#121212",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h4" sx={{ color: "#ffffff" }}>
          Hund Erstellen
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          color: "#FFFFFF",
        }}
      >
        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 2, width: "100%", maxWidth: 400 }}
          >
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: 400 }}>
            {errorMessage}
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
          <Typography variant="caption" sx={{ ml: 1, color: "#aaa" }}>
            Max. 2MB
          </Typography>
        </label>
        {previewUrl && (
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
              marginBottom: "20px",
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        )}
        <Box component="form" sx={{ width: "100%", maxWidth: 400 }}>
          {/* Rest of your form fields remain the same */}
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
          {/* ... other fields ... */}
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
    </Box>
  );
};

export default CreateDogPage;
