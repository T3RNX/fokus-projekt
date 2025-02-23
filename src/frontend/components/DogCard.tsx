import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dog, deleteDog } from "../API/Dog";

interface DogCardProps extends Dog {
  onDelete?: () => void;
}

const DogCard: React.FC<DogCardProps> = ({ id, name, age, onDelete }) => {
  const handleDelete = async () => {
    try {
      if (id !== undefined) {
        await deleteDog(id);
        if (onDelete) {
          onDelete();
        }
      } else {
        console.error("Dog ID is undefined");
        alert("Failed to delete dog. Dog ID is undefined.");
      }
    } catch (error) {
      console.error("Error deleting dog:", error);
      alert("Failed to delete dog. Please try again.");
    }
  };

  return (
    <Card
      sx={{
        minWidth: 300,
        maxWidth: 300,
        margin: 2,
        textAlign: "center",
        boxShadow: 3,
        position: "relative",
      }}
    >
      <IconButton
        onClick={handleDelete}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
      <CardMedia
        component="img"
        height="200"
        image="https://example.com/valid-image.jpg"
      />
      <CardContent sx={{ backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {name.toUpperCase()}, {age} JAHRE
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DogCard;
