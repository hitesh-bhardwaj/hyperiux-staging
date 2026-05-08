"use client"

import React, { useState } from 'react';
import CubeCanvasBackground from './CubeCanvasBackground';

const characters = [
  { char: "A", fill: false },
  { char: "M", fill: false },
  { char: "B", fill: false },
  { char: "X", fill: false },
  { char: "C", fill: true },
  { char: "R", fill: true },
  { char: "E", fill: true },
  { char: "A", fill: true },
  { char: "T", fill: true },
  { char: "I", fill: true },
  { char: "V", fill: true },
  { char: "E", fill: true },
  { char: "F", fill: false },
  { char: "V", fill: false },
  { char: "E", fill: false },
  { char: "I", fill: false },
  { char: "B", fill: false },
  { char: "U", fill: true },
  { char: "Q", fill: false },
  { char: "L", fill: false },
  { char: "X", fill: false },
  { char: "S", fill: false },
  { char: "U", fill: false },
  { char: "N", fill: false },
  { char: "F", fill: false },
  { char: "T", fill: false },
  { char: "C", fill: false },
  { char: "Z", fill: false },
  { char: "K", fill: false },
  { char: "S", fill: false },
  { char: "R", fill: true },
  { char: "Y", fill: false },
  { char: "H", fill: false },
  { char: "N", fill: false },
  { char: "F", fill: true , rotate:true},
  { char: "W", fill: false },
  { char: "M", fill: false },
  { char: "A", fill: false },
  { char: "J", fill: false },
  { char: "J", fill: false },
  { char: "A", fill: true },
  { char: "M", fill: true },
  { char: "B", fill: true },
  { char: "I", fill: true },
  { char: "T", fill: true },
  { char: "I", fill: true },
  { char: "O", fill: true },
  { char: "U", fill: true , rotate:true},
  { char: "S", fill: true },
  { char: "V", fill: false },
  { char: "Z", fill: false },
  { char: "F", fill: false },
  { char: "Y", fill: false },
  { char: "D", fill: false },
  { char: "A", fill: false },
  { char: "T", fill: false },
  { char: "O", fill: true },
  { char: "B", fill: false },
  { char: "G", fill: false },
  { char: "E", fill: false },
  { char: "N", fill: true , rotate:true },
  { char: "J", fill: false },
  { char: "B", fill: false },
  { char: "C", fill: false },
  { char: "O", fill: false },
  { char: "F", fill: false },
  { char: "H", fill: false },
  { char: "W", fill: false },
  { char: "P", fill: false },
  { char: "U", fill: true },
  { char: "A", fill: false },
  { char: "T", fill: false },
  { char: "S", fill: false },
  { char: "K", fill: false },
  { char: "Z", fill: false },
  { char: "Q", fill: false },
  { char: "B", fill: false },
  { char: "L", fill: false },
  { char: "V", fill: false },
  { char: "P", fill: true },
  { char: "A", fill: true },
  { char: "S", fill: true },
  { char: "S", fill: true },
  { char: "I", fill: true },
  { char: "O", fill: true },
  { char: "N", fill: true },
  { char: "A", fill: true },
  { char: "T", fill: true },
  { char: "E", fill: true },
  { char: "K", fill: false },
  { char: "I", fill: false }
];

const WhatWeAreActive = () => {
  const [hoveredIndices, setHoveredIndices] = useState([]);

  const handleHover = (index) => {
    if (!hoveredIndices.includes(index)) {
      setHoveredIndices((prev) => [...prev, index]);
    }
  };

  return (
    <section className="w-screen h-screen px-[4vw] text-[#111111] overflow-hidden absolute left-0 bottom-0 z-[7]" id='charactersGrid'>
      <style jsx>{`
        @keyframes rotate360 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .rotate-continuous {
          animation: rotate360 2s linear infinite;
        }
      `}</style>
       <div className="absolute inset-0 z-[1] h-screen w-screen overflow-hidden">
              <CubeCanvasBackground />
            </div>
     <div className='max-sm:scale-[1.8] max-sm:mt-[85%] relative z-[3] opacity-0 word-play'>
      <div className="flex items-center justify-between flex-wrap gap-y-[3.5vh] gap-x-[2.5vw] pt-[5%] charactersGrid max-sm:gap-y-[2.5vw] max-sm:gap-x-[2.5vw] max-sm:py-[5%] max-sm:rotate-[90deg] max-sm:!scale-y-[-1]">
        {characters.map((item, index) => {
          const isHovered = hoveredIndices.includes(index);
          const isRotating = item.rotate === true;

          return (
            <div
              key={index}
              onMouseEnter={() => item.fill && handleHover(index)}
              className={`group relative p-[2.2vw] text-[3vw] font-aeonik h-[3vw] w-[3vw] flex items-center justify-center rounded-[0.8vw] overflow-hidden text-black max-sm:rotate-[-90deg] max-sm:scale-x-[-1] max-sm:text-[3.5vw]
                ${item.fill ? 'cursor-pointer' : ''}
              
              `}
            >
              {item.fill && (
                <span className={`absolute inset-0 bg-black transition-transform duration-300 z-0 origin-left ${
                  isHovered ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              )}
              <span className={`relative z-10 ${item.fill ? `transition-colors duration-300 ${isHovered ? 'text-white' : 'group-hover:text-white'}` : ''}`}>
                {item.char}
              </span>
            </div>
          );
        })}
      </div>
      </div> 
    </section>
  );
};

export default WhatWeAreActive;