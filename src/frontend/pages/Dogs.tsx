import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddButton from '../components/AddButton';
import DogCard from '../components/DogCard';
import { Dog } from '../API/Dog';
import React from 'react';

const Dogs = () => {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    const storedDogs = localStorage.getItem('dogs');
    if (storedDogs) {
      setDogs(JSON.parse(storedDogs));
    }
  }, []);

  const handleAddClick = () => {
    navigate('/dogs/create');
  };

  return (
    <Box sx={{ position: 'relative', padding: 2 }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 16,
        }}
      >
        <AddButton onClick={handleAddClick} />
      </Box>
      <Typography variant="h4" gutterBottom>
        Hunde
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {dogs.map((dog, index) => (
          <DogCard key={index} {...dog} />
        ))}
      </Box>
    </Box>
  );
};

export default Dogs;
