import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Dog } from "../API/Dog";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../API/Dog";

interface DogCardProps extends Dog {
  onDelete?: () => void;
}

const DogCard: React.FC<DogCardProps> = ({ dogID, name, age, imagePath }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dogs/${dogID}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        minWidth: 300,
        maxWidth: 300,
        margin: 2,
        textAlign: "center",
        boxShadow: 3,
        position: "relative",
        cursor: "pointer",
      }}
    >
      <CardMedia component="img" height="200" image={getImageUrl(imagePath)} />
      <CardContent sx={{ backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {name.toUpperCase()}, {age} JAHRE
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DogCard;
