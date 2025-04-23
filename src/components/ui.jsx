// components/UI.js – light‑theme primitives

import React from "react";

export const Button = ({ className = "", pulse = false, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded
      bg-orange-500 hover:bg-orange-400 text-white dark:bg-orange-600 dark:hover:bg-orange-500
      disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300
      ${
        pulse ? "animate-pulse shadow-lg shadow-orange-500/40" : ""
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
