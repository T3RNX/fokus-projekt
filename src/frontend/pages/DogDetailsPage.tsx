import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, Grid } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { Dog, getDogById, deleteDog, getImageUrl } from "../API/Dog";

interface EditableDogFields {
  name: string;
  age: string;
  race: string;
  weight: string;
  ownerID: string;
}

const DogDetailsPage = () => {
  const { dogID } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [description, setDescription] = useState("");
  const [editableFields, setEditableFields] = useState<EditableDogFields>({
    name: "",
    age: "",
    race: "",
    weight: "",
    ownerID: "",
  });

  useEffect(() => {
    const fetchDog = async () => {
      if (!dogID) return;
      try {
        const fetchedDog = await getDogById(parseInt(dogID, 10));
        setDog(fetchedDog);
        setEditableFields({
          name: fetchedDog.name || "",
          age: fetchedDog.age?.toString() || "",
          race: fetchedDog.race || "",
          weight: fetchedDog.weight?.toString() || "",
          ownerID: fetchedDog.ownerID?.toString() || "",
        });
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
          headers: { "Content-Type": "application/json" },
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

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveDetails = async () => {
    if (!dogID) return;

    try {
      const formData = new FormData();
      formData.append("Name", editableFields.name);
      formData.append("Age", editableFields.age);
      formData.append("Race", editableFields.race);
      formData.append("Weight", editableFields.weight);
      formData.append("OwnerID", editableFields.ownerID);

      if (dog?.description) {
        formData.append("Description", dog.description);
      }

      const response = await fetch(`https://localhost:7202/Dog/${dogID}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update dog details");

      setDog((prev) =>
        prev
          ? {
              ...prev,
              name: editableFields.name,
              age: parseInt(editableFields.age) || 0,
              race: editableFields.race,
              weight: parseFloat(editableFields.weight) || 0,
              ownerID: parseInt(editableFields.ownerID) || 0,
            }
          : null
      );

      setIsEditingDetails(false);
    } catch (error) {
      console.error("Error updating dog details:", error);
    }
  };

  const handleCancelDetailsEdit = () => {
    if (dog) {
      setEditableFields({
        name: dog.name || "",
        age: dog.age?.toString() || "",
        race: dog.race || "",
        weight: dog.weight?.toString() || "",
        ownerID: dog.ownerID?.toString() || "",
      });
    }
    setIsEditingDetails(false);
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
        px: { xs: 2, md: 4 },
        pt: { xs: 8, sm: 6, md: 4 },
        pb: { xs: 6, md: 4 },
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
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} lg={5}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 500,
                height: { xs: 200, sm: 250, md: 300 },
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#2c2c2c",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                mx: "auto",
                flexShrink: 0,
              }}
            >
              {dog?.dogID && (
                <>
                  <img
                    src={getImageUrl(dog.dogID)}
                    alt={dog.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = "none";
                      const fallback =
                        e.currentTarget.parentElement?.querySelector(
                          ".fallback"
                        );
                      if (fallback)
                        (fallback as HTMLElement).style.display = "flex";
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    className="fallback"
                    sx={{
                      display: "none",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      color: "#666",
                      position: "absolute",
                    }}
                  >
                    <PetsIcon sx={{ fontSize: 60 }} />
                    <Typography variant="body2">Kein Bild vorhanden</Typography>
                  </Box>
                </>
              )}
              {!dog?.dogID && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    color: "#666",
                  }}
                >
                  <PetsIcon sx={{ fontSize: 60 }} />
                  <Typography variant="body2">Kein Bild vorhanden</Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              {!isEditingDetails ? (
                <Button
                  variant="contained"
                  onClick={() => setIsEditingDetails(true)}
                  sx={{
                    bgcolor: "#ff6c3e",
                    "&:hover": { bgcolor: "#ff5722" },
                    fontWeight: "bold",
                  }}
                >
                  EDIT
                </Button>
              ) : (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveDetails}
                    sx={{
                      bgcolor: "#ff6c3e",
                      "&:hover": { bgcolor: "#ff5722" },
                      fontWeight: "bold",
                    }}
                  >
                    SAVE
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCancelDetailsEdit}
                    sx={{
                      bgcolor: "#2c2c2c",
                      "&:hover": { bgcolor: "#444" },
                    }}
                  >
                    CANCEL
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Alter", name: "age", type: "number" },
                { label: "Rasse", name: "race", type: "text" },
                { label: "Gewicht", name: "weight", type: "number" },
                { label: "Besitzer", name: "ownerID", type: "number" },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={
                      isEditingDetails
                        ? editableFields[field.name as keyof EditableDogFields]
                        : (dog?.[field.name as keyof Dog] || "").toString()
                    }
                    disabled={!isEditingDetails}
                    onChange={handleFieldChange}
                    type={field.type}
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Box>
          <TextField
            label="Beschreibung"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (!isEditing) setIsEditing(true);
            }}
            onClick={() => {
              if (!isEditing) setIsEditing(true);
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
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                onClick={handleSaveDescription}
                variant="contained"
                sx={{
                  bgcolor: "#ff6c3e",
                  "&:hover": { bgcolor: "#ff5722" },
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
            value=""
            disabled
            fullWidth
            multiline
            rows={4}
            sx={textFieldStyle}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
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

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#2c2c2c",
    color: "#fff",
    borderRadius: 1,
    "& fieldset": {
      borderColor: "#444",
    },
    "&.Mui-disabled": {
      color: "#fff",
      WebkitTextFillColor: "#fff",
      "& fieldset": {
        borderColor: "#444",
      },
    },
    "& input": {
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
