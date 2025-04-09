"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import DogCard from "../components/DogCard";
import { type Dog, getAllDogs } from "../API/Dog";
import React from "react";

const Dogs = () => {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDogs = async () => {
    try {
      setIsLoading(true);
      const fetchedDogs = await getAllDogs();
      setDogs(fetchedDogs);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    } finally {
      setIsLoading(false);
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
    <div>
      <div className="mb-6 relative">
        <h1 className="text-3xl font-bold text-foreground">Hunde</h1>
        <p className="text-muted-foreground mt-2">
          Verwalten Sie Ihre Hunde und deren Informationen
        </p>
        <div className="absolute right-0 top-0">
          <AddButton onClick={handleAddClick} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
        </div>
      ) : dogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-card rounded-lg p-8 border border-border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4"
          >
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
            <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
            <path d="M8 14v.5" />
            <path d="M16 14v.5" />
            <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
            <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
          </svg>
          <p className="text-xl">Keine Hunde gefunden</p>
          <p className="mt-2">Klicken Sie auf +, um einen Hund hinzuzufügen</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dogs.map((dog) => (
            <DogCard key={dog.dogID} {...dog} onDelete={handleDeleteDog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dogs;
