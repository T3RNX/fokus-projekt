import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Dog, getImageUrl } from "../API/Dog";

interface DogCardProps extends Dog {
  onDelete?: () => void;
}

const DogCard: React.FC<DogCardProps> = ({ dogID, name, age }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/dogs/${dogID}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-card rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg border border-border hover:border-[#ff6c3e]"
    >
      <div className="h-[240px] relative bg-muted flex justify-center items-center">
        {!dogID || imageError ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
              <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
              <path d="M8 14v.5" />
              <path d="M16 14v.5" />
              <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
              <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
            </svg>
            <p className="text-sm">Kein Bild vorhanden</p>
          </div>
        ) : (
          <img
            src={getImageUrl(dogID) || "/placeholder.svg"}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-card-foreground">{name}</h2>
        <p className="text-muted-foreground">{age} Jahre alt</p>
      </div>
    </div>
  );
};

export default DogCard;
