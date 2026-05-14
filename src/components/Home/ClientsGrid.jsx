"use client";
import React from "react";
import Image from "next/image";
import HeadAnim from "../Animations/HeadAnim";

const data = [
{
   id: 1,
    img: "/assets/images/homepage/clients-grid-images/montra-logo.svg",
    alt: "montra",
    bgimg: "/assets/images/homepage/clients-grid-images/montra-bg.png",
},
{
   id: 2,
    img: "/assets/images/homepage/clients-grid-images/monielink-logo.svg",
    alt: "monielink",
    bgimg: "/assets/images/homepage/clients-grid-images/monielink-bg.png",
},
{
   id: 3,
    img: "/assets/images/homepage/clients-grid-images/yellow-logo.svg",
    alt: "yellow",
    bgimg: "/assets/images/homepage/clients-grid-images/yellow-bg.png",
},
{
   id: 4,
    img: "/assets/images/homepage/clients-grid-images/bespin-labs-logo.svg",
    alt: "bespin-labs",
    bgimg: "/assets/images/homepage/clients-grid-images/bespin-labs-bg.png",
},
{
   id: 5,
    img: "/assets/images/homepage/clients-grid-images/dsw-logo.svg",
    alt: "dsw",
    bgimg: "/assets/images/homepage/clients-grid-images/dsw-bg.png",
},
{
   id: 6,
    img: "/assets/images/homepage/clients-grid-images/patronum-logo.svg",
    alt: "patronum",
    bgimg: "/assets/images/homepage/clients-grid-images/patronum-bg.png",
},
{
   id: 7,
    img: "/assets/images/homepage/clients-grid-images/quickX-logo.svg",
    alt: "quickx",
    bgimg: "/assets/images/homepage/clients-grid-images/quickx-bg.png",
},
{
   id: 8,
    img: "/assets/images/homepage/clients-grid-images/kedarkala-logo.svg",
    alt: "kedarkala",
    bgimg: "/assets/images/homepage/clients-grid-images/kedarkala-bg.png",
},
{
   id: 9,
    img: "/assets/images/homepage/clients-grid-images/dmtca-logo.svg",
    alt: "dmtca",
    bgimg: "/assets/images/homepage/clients-grid-images/dmtca-bg.png",
},
{
   id: 10,
    img: "/assets/images/homepage/clients-grid-images/ams-logo.svg",
    alt: "ams",
    bgimg: "/assets/images/homepage/clients-grid-images/ams-bg.png",
},
{
   id: 11,
    img: "/assets/images/homepage/clients-grid-images/patra-logo.svg",
    alt: "patra",
    bgimg: "/assets/images/homepage/clients-grid-images/patra-bg.png",
},
{
   id: 12,
    img: "/assets/images/homepage/clients-grid-images/hiveminds-logo.svg",
    alt: "hiveminds",
    bgimg: "/assets/images/homepage/clients-grid-images/hiveminds-bg.png",
}
];

const ClientCard = ({ img, bg, alt, id, index, totalItems }) => {
  const cols = 4;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const totalRows = Math.ceil(totalItems / cols);
  const isTopRow = row === 0;
  const isBottomRow = row === totalRows - 1;
  const isLeftCol = col === 0;
  const isRightCol = col === cols - 1;
  let borderClasses = "border-[#D9D9D9] ";

  borderClasses += isTopRow ? "border-t-[1px] " : "border-t-[0.5px] ";
  borderClasses += isBottomRow ? "border-b-[1px] " : "border-b-[0.5px] ";
  borderClasses += isLeftCol ? "border-l-[1px] " : "border-l-[0.5px] ";
  borderClasses += isRightCol ? "border-r-[1px] " : "border-r-[0.5px] ";

  return (
    <div
      key={id}
      className={`h-full w-full p-[1.7vw] group duration-300 transition-all relative overflow-hidden max-sm:p-[5vw] ${borderClasses} ${index==totalItems-1?"max-sm:hidden":""}`}
    >
      <Image
        src={bg}
        width={100}
        height={100}
        quality={100}
        alt={`${alt} background`}
        style={{
          transitionTimingFunction: "cubic-bezier(.33,1,.48,.89)",
          transitionDuration: "1s",
        }}
        className="absolute top-0 left-0 w-full h-full object-cover opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100"
      />
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <Image
          src={img}
          width={200}
          height={150}
          alt={alt}
          style={{
            transitionTimingFunction: "cubic-bezier(.33,1,.48,.89)",
            transitionDuration: "0.5s",
          }}
          className="object-contain w-full h-full grayscale-100 scale-[1.2] invert group-hover:invert-0"
        />
      </div>
    </div>
  );
};

const ClientsGrid = () => {
  return (
    <section
      className="h-full w-screen pt-[7%] px-[5vw] bg-[#fefefe] relative z-50 text-[#111111] max-sm:px-[7vw] max-sm:py-[15%]"
      id="clients"
    >
      <div className="space-y-[5vw] max-sm:space-y-[10vw]">
        <div className="w-full flex items-center max-sm:justify-start">
          {/* <Copy> */}
          <HeadAnim>
            <h2 className="font-aeonik text-[5.2vw] leading-[1.2] max-sm:text-[11vw]">
              Clients Love Us!
            </h2>
          </HeadAnim>
          {/* </Copy> */}
        </div>

        <div className="grid grid-cols-4 max-sm:grid-cols-2 fadeup relative z-50">
          {data.map((item, index) => (
            <ClientCard
              key={item.id}
              img={item.img}
              id={item.id}
              alt={item.alt}
              bg={item.bgimg}
              index={index}
              totalItems={data.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsGrid;
