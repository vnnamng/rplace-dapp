// constants.js
// Shared constants: contract details & palette

export const CONTRACT_ADDRESS = "0x84B0FD3dd1288542f4E189f8170eB94B303214C3";
export const ABI = [
  "function getPixels() view returns (address[2500] owners, uint8[2500] colors, uint256[2500] prices)",
  "function buyPixels(uint16[] xs, uint16[] ys, uint8[] colors) payable",
  "event PixelBought(uint16 indexed x, uint16 indexed y, uint8 colour)",
];

export const RPC_URL = "https://rpc.ankr.com/eth_sepolia";

export const PALETTE = [
  "#FFFFFF",
  "#E4E4E4",
  "#888888",
  "#222222",
  "#FFA7D1",
  "#E50000",
  "#E59500",
  "#A06A42",
  "#E5D900",
  "#94E044",
];

export const shorten = (addr) =>
  addr === "0x0000000000000000000000000000000000000000"
    ? "—"
    : `${addr.slice(0, 6)}…${addr.slice(-4)}`;
