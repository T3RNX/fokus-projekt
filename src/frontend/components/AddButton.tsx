import React from "react";

interface AddButtonProps {
  onClick?: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#ff6c3e",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    color: "white",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    outline: "none",
    transition: "transform 0.2s ease",
  };

  const hoverStyle: React.CSSProperties = {
    transform: "scale(1.1)",
  };

  const activeStyle: React.CSSProperties = {
    transform: "scale(0.95)",
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...buttonStyle,
        ...(isHovered ? hoverStyle : {}),
        ...(isActive ? activeStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      +
    </button>
  );
};

export default AddButton;
