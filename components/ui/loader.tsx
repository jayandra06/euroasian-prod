import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large"; // Define valid size values
}

const Loader: React.FC<LoaderProps> = ({ size = "medium" }) => {
  return (
    <div className={`loader ${size}`}>
      <div className={`spinner ${size}`}></div>
    </div>
  );
};

export default Loader;
