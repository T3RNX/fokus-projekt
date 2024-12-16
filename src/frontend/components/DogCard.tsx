import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Dog } from '../API/Dog';

const DogCard: React.FC<Dog> = ({ name, age }) => (
  <Card sx={{ maxWidth: 345, margin: 2, textAlign: 'center', boxShadow: 3 }}>
    <CardMedia
      component="img"
      height="200"
      image="https://via.placeholder.com/300x200"
    />
    <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" component="div" fontWeight="bold">
        {name.toUpperCase()}, {age} JAHRE
      </Typography>
    </CardContent>
  </Card>
);

export default DogCard;
