// components/UI.js – light‑theme primitives

import React from "react";

export const Button = ({ className = "", pulse = false, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 ${
      pulse ? "animate-pulse shadow-lg shadow-blue-400/40" : ""
    } ${className}`}
  />
);

export const Card = ({ className = "", ...props }) => (
  <div
    {...props}
    className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
  />
);

export const CardContent = ({ className = "", ...props }) => (
  <div {...props} className={`p-4 text-sm text-black ${className}`} />
);
