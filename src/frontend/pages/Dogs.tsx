import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddButton from '../components/AddButton';
import DogCard from '../components/DogCard';
import { Dog, getAllDogs } from '../API/Dog';
import React from 'react';

const Dogs = () => {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const fetchedDogs = await getAllDogs();
        setDogs(fetchedDogs);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };

    fetchDogs();
  }, []);

  const handleAddClick = () => {
    navigate('/dogs/create');
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        padding: 2,
        height: '100%',
        overflow: 'auto', // Enable scrolling
        maxHeight: 'calc(100vh - 32px)', // Account for padding
      }}
    >
      <Box
        sx={{
          position: 'sticky', // Change to sticky
          top: 0,
          right: 16,
          zIndex: 1, // Ensure button stays on top
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          backgroundColor: '#121212', // Match background color
        }}
      >
        <Typography variant="h4">
          Hunde
        </Typography>
        <AddButton onClick={handleAddClick} />
      </Box>
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 2, // Add consistent spacing between cards
        }}
      >
        {dogs.map((dog, index) => (
          <DogCard key={index} {...dog} />
        ))}
      </Box>
    </Box>
  );
};

export default Dogs;