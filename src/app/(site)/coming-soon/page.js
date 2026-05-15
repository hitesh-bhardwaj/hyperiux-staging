// app/coming-soon/page.jsx

import ComingSoonOverlay from "@/components/ComingSoonOverlay";
import ComingSoonAbout from "@/components/ComingSoonOverlay/About";
import HyperiuxLogo from "@/components/HyperiuxLogo/HyperiuxLogo";
import React from "react";

const page = () => {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <HyperiuxLogo />

      <ComingSoonOverlay
        targetDate="2026-10-01T00:00:00"
        title={
          <>
            Digital
            <br />
            Experience
            <br />
            Design Agency
          </>
        }
      />
      <ComingSoonAbout/>
    </main>
  );
};

export default page;