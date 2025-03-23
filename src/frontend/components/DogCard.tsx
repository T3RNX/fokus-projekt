import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Dog } from "../API/Dog";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../API/Dog";
import PetsIcon from "@mui/icons-material/Pets";

interface DogCardProps extends Dog {
  onDelete?: () => void;
}

const DogCard: React.FC<DogCardProps> = ({ dogID, name, age }) => {
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
      <Box
        sx={{
          height: 200,
          position: "relative",
          backgroundColor: "#1E1E1E",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!dogID ? (
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
        ) : (
          <img
            src={getImageUrl(dogID)}
            alt={name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
              const fallback =
                e.currentTarget.parentElement?.querySelector(".fallback");
              if (fallback) (fallback as HTMLElement).style.display = "flex";
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
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
      </Box>
      <CardContent sx={{ backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {name.toUpperCase()}, {age} JAHRE
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DogCard;
