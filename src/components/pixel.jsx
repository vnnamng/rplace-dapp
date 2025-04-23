// components/Pixel.jsx – ensure truly black border on select
import React from "react";
import { PALETTE, shorten } from "../constants";

const Pixel = React.memo(function Pixel({
  x,
  y,
  idx,
  colourIdx,
  selected,
  owner,
  price,
  onToggle,
  onHover,
}) {
  const baseClasses = "w-4 h-4 cursor-pointer transition-transform";
  const borderClasses = selected
    ? "border-4 border-black shadow-md"
    : "border border-gray-200";

  return (
    <div
      className={`${baseClasses} ${borderClasses}`}
      style={{ backgroundColor: PALETTE[colourIdx] }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        onHover({ x, y, owner, price, colourIdx });
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        onHover(null);
      }}
      onClick={() => onToggle(idx)}
      title={`(${x},${y})\nColour #${colourIdx}\nOwner ${shorten(owner)}`}
    />
  );
});

export default Pixel;
