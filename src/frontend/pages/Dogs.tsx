import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import DogCard from "../components/DogCard";
import { Dog, getAllDogs } from "../API/Dog";
import React from "react";

const Dogs = () => {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState<Dog[]>([]);

  const fetchDogs = async () => {
    try {
      const fetchedDogs = await getAllDogs();
      setDogs(fetchedDogs);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const handleAddClick = () => {
    navigate("/dogs/create");
  };

  const handleDeleteDog = () => {
    fetchDogs();
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#121212",
        marginTop: "-20px",
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
          Hunde
        </Typography>
        <AddButton onClick={handleAddClick} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          padding: 2,
          marginTop: 0,
        }}
      >
        {dogs.map((dog) => (
          <DogCard key={dog.dogID} {...dog} onDelete={handleDeleteDog} />
        ))}
      </Box>
    </Box>
  );
};

export default Dogs;
