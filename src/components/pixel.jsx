// components/Pixel.jsx – ensure truly black border on select
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { PALETTE, shorten } from "../constants";
import { ethers } from "ethers";

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

  const tooltipContent = (
    <div className="text-xs leading-5">
      <div>{`(${x}, ${y})`}</div>
      <div>{`Colour #${colourIdx}`}</div>
      <div>{`Owner ${shorten(owner)}`}</div>
      <div>{`Last price: ${price ? ethers.formatEther(price) : "0"} ETH`}</div>
    </div>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top" followCursor>
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
      />
    </Tooltip>
  );
});

export default Pixel;
