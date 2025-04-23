// RPlaceApp.jsx – light theme + bordered canvas box
// ----------------------------------------------------
// Re‑styles main container and canvas wrapper for a white UI.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

import { Button, Card, CardContent } from "./components/ui";
import Pixel from "./components/pixel";
import { CONTRACT_ADDRESS, ABI, RPC_URL, PALETTE, shorten } from "./constants";

export default function RPlaceApp() {
  /* Providers */
  const [readContract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const provider = window.ethereum
      ? new ethers.BrowserProvider(window.ethereum)
      : new ethers.JsonRpcProvider(RPC_URL);
    setReadContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, provider));
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    setAccount(await signer.getAddress());
    setWriteContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, signer));
  };

  /* Pixel state */
  const [colours, setColours] = useState(() => new Uint8Array(2500));
  const [owners, setOwners] = useState(() =>
    Array(2500).fill(ethers.ZeroAddress)
  );
  const [prices, setPrices] = useState(() => Array(2500).fill(0n));

  const decodeColours = (arr) =>
    arr instanceof Uint8Array ? arr : new Uint8Array(arr.map(Number));

  const loadPixels = useCallback(async () => {
    if (!readContract) return;
    try {
      const [ownersRaw, coloursRaw, pricesRaw] = await readContract.getPixels();
      setColours(decodeColours(coloursRaw));
      setOwners(Array.from(ownersRaw));
      setPrices(Array.from(pricesRaw, (p) => BigInt(p)));
    } catch (err) {
      console.error("getPixels failed", err);
    }
  }, [readContract]);

  useEffect(() => {
    loadPixels();
  }, [loadPixels]);

  useEffect(() => {
    if (writeContract) loadPixels();
  }, [writeContract, loadPixels]);

  /* Live event updates */
  useEffect(() => {
    if (!readContract) return;
    const handler = (x, y, colour) => {
      const idx = Number(x) * 50 + Number(y);
      setColours((old) => {
        const next = Uint8Array.from(old);
        next[idx] = Number(colour);
        return next;
      });
    };
    readContract.on("PixelBought", handler);
    return () => readContract.off("PixelBought", handler);
  }, [readContract]);

  /* Interaction */
  const [selected, setSelected] = useState(() => new Set());
  const [chosenColour, setChosenColour] = useState(0);
  const [priceEachEth, setPriceEachEth] = useState("");
  const [hoverInfo, setHoverInfo] = useState(null);

  const toggle = useCallback((idx) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }, []);

  const buy = async () => {
    if (!writeContract) return alert("Connect wallet first");
    if (selected.size === 0) return;

    const xs = [];
    const ys = [];
    const colourArr = [];
    selected.forEach((idx) => {
      xs.push(Math.floor(idx / 50));
      ys.push(idx % 50);
      colourArr.push(chosenColour);
    });

    const priceEachWei = ethers.parseEther(priceEachEth || "0");
    if (priceEachWei === 0n) return alert("Enter price per pixel");
    const total = priceEachWei * BigInt(selected.size);

    try {
      const tx = await writeContract.buyPixels(xs, ys, colourArr, {
        value: total,
      });
      await tx.wait();
      setSelected(new Set());
      setPriceEachEth("");
      loadPixels();
    } catch (err) {
      console.error(err);
      alert(err?.reason || "Transaction failed");
    }
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  /* Derived */
  const colourList = useMemo(() => Array.from(colours), [colours]);
  const pulse = selected.size > 0 && priceEachEth !== "";

  const total = useMemo(() => {
    if (!priceEachEth || selected.size === 0) return "0";
    try {
      const priceWei = ethers.parseEther(priceEachEth); // bigint
      const totalWei = priceWei * BigInt(selected.size); // multiply bigints
      return ethers.formatEther(totalWei); // back to ETH string
    } catch {
      return "0";
    }
  }, [priceEachEth, selected]);

  /* Render */
  return (
    <div className="min-h-screen bg-white text-black p-6 space-y-6">
      <h1 className="text-2xl font-bold">RPlaceV2 DApp</h1>

      {!account ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <p>Connected: {shorten(account)}</p>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas box */}
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <div className="grid grid-cols-50">
            {colourList.map((c, idx) => {
              const x = Math.floor(idx / 50);
              const y = idx % 50;
              return (
                <Pixel
                  key={idx}
                  x={x}
                  y={y}
                  idx={idx}
                  colourIdx={c}
                  selected={selected.has(idx)}
                  owner={owners[idx]}
                  price={prices[idx]}
                  onToggle={toggle}
                  onHover={setHoverInfo}
                />
              );
            })}
          </div>
        </div>

        {/* Info panel */}
        <div className="min-w-[220px] lg:w-64">
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent>
              {hoverInfo ? (
                <>
                  <p className="font-semibold mb-1">
                    Pixel ({hoverInfo.x}, {hoverInfo.y})
                  </p>
                  <p>Colour index: {hoverInfo.colourIdx}</p>
                  <p>Owner: {shorten(hoverInfo.owner)}</p>
                  <p>Last price: {ethers.formatEther(hoverInfo.price)} ETH</p>
                </>
              ) : (
                <p className="text-gray-500">Hover a pixel to see details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Palette */}
      <div className="flex flex-wrap gap-2 items-center">
        {PALETTE.map((hex, i) => (
          <div
            key={i}
            onClick={() => setChosenColour(i)}
            className={`w-6 h-6 cursor-pointer border-2 transition-transform duration-150 ${
              i === chosenColour
                ? "border-black scale-125"
                : "border-gray-200 hover:scale-110"
            }`}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          className="bg-white border border-gray-300 rounded px-3 py-2 w-40"
          placeholder="ETH / pixel"
          value={priceEachEth}
          onChange={(e) => setPriceEachEth(e.target.value)}
        />
        {/* ── NEW TOTAL CARD ── */}
        <Card className="bg-gray-50 border border-gray-200 px-4 py-2">
          <CardContent>Total: {total} ETH</CardContent>
        </Card>
        <Button disabled={selected.size === 0} pulse={pulse} onClick={buy}>
          Buy {selected.size} pixel{selected.size === 1 ? "" : "s"}
        </Button>
        <Button onClick={clearSelection} disabled={selected.size === 0}>
          Clear Selection
        </Button>
      </div>
    </div>
  );
}
