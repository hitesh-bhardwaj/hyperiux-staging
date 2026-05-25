"use client";

import React, { forwardRef } from "react";

const BottomMenuOverlay = forwardRef(function BottomMenuOverlay(
  { onClick },
  ref
) {
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[399] bg-black/30 opacity-0 pointer-events-none"
      onClick={onClick}
    />
  );
});

export default BottomMenuOverlay;