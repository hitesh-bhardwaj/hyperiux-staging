"use client"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Arrow, LinkButton } from "../../Buttons";
import HeadAnim from "@/components/Animations/HeadAnim";
import Copy from "@/components/Animations/Copy";

const data = [
  {
    img: "/assets/images/homepage/work/our-work-1.png",
    title: "Montra",
    para:"We specialize in crafting one-of-a-kind, unforgettable experiences that captivate and engage your customers, leaving them craving for more.",
    link: "/#",
  },
  {
    img: "/assets/images/homepage/work/our-work-2.png",
    title: "Yellow",
    para:"We specialize in crafting one-of-a-kind, unforgettable experiences that captivate and engage your customers, leaving them craving for more.",
    link: "/#",
  },
  {
    img: "/assets/images/homepage/work/our-work-3.png",
    title: "Patronum",
    para:"We specialize in crafting one-of-a-kind, unforgettable experiences that captivate and engage your customers, leaving them craving for more.",
    link: "/#",
  },
  {
    img: "/assets/images/homepage/work/our-work-5.png",
    title: "Monielink",
    para:"We specialize in crafting one-of-a-kind, unforgettable experiences that captivate and engage your customers, leaving them craving for more.",
    link: "/#",
  },
];

const WorkCard = ({ img, title, link,para }) => {
  return (
    <>
      <Link href={link} className="w-full h-full space-y-[4vw] max-sm:space-y-[6vw] relative">
        <div className="w-full h-[40vh] fadeup rounded-[6vw] overflow-hidden ">
          <Image
            quality={100}
            src={img}
            alt="work"
            className="w-full h-full object-cover"
            width={800}
            height={500}
          />
        </div>
        <div className="space-y-[3vw]">
          <HeadAnim>
            <h3 className="text-[10vw]! pl-[2vw] text-black">{title}</h3>
          </HeadAnim>
          <Copy>
            <p className="text-16 text-[#1E1E1E] pl-[2vw] max-sm:leading-normal">{para}</p>
          </Copy>
        </div>
         
      
        <div className="h-[13vw] fadeup w-[13vw] absolute top-5 right-5 bg-white rounded-full p-[4vw] text-[#ff5f00]">
         <Arrow/>
        </div>
      </Link>
    </>
  );
};
const WorkMobile = () => {
  return (
    <section className="bg-[#FFFFFF] h-full w-screen px-[7vw] pt-[10%] pb-[15%] hidden max-sm:block  z-10">
      <div className="h-full w-full flex flex-col items-start justify-center space-y-[10vw]">
        {data.map((item, index) => (
          <WorkCard
            img={item.img}
            title={item.title}
            key={index}
            link={item.link}
            para={item.para}
          />
        ))}
       <div className="pl-[2vw]">
        <LinkButton
          text={"View All Projects"}
          href={"#"}
          hover={""}
          className="text-[3.5vw] "
        />
       </div>
      </div>
    </section>
  );
};

export default WorkMobile;
