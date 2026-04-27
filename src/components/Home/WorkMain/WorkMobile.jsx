import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Arrow, LinkButton } from "../../Buttons";

const data = [
  {
    img: "/assets/images/homepage/work/our-work-1.png",
    title: "Montra",
    link: "/#",
  },
  {
    img: "/assets/images/homepage/work/our-work-2.png",
    title: "Yellow",
    link: "/#",
  },
  {
    img: "/assets/images/homepage/work/our-work-3.png",
    title: "Patronum",
    link: "/#",
  },
  {
    img: "/assets/images/homepage/work/our-work-4.png",
    title: "Montra App",
    link: "/#",
  },
  {
    img: "/assets/images/homepage/work/our-work-5.png",
    title: "Monielink",
    link: "/#",
  },
];

const WorkCard = ({ img, title, link }) => {
  return (
    <>
      <Link href={link} className="w-full h-full space-y-[4vw] relative">
        <div className="w-full h-[48vh] rounded-[6vw] overflow-hidden ">
          <Image
            quality={100}
            src={img}
            alt="work"
            className="w-full h-full object-cover work-mockup-1-img"
            width={800}
            height={500}
          />
        </div>
        <div>
          <h3 className="!text-[10vw] pl-[2vw]">{title}</h3>
        </div>
        <div className="h-[10vw] w-[10vw] absolute top-5 right-5 bg-black rounded-full p-[3vw] text-white">
         <Arrow/>
        </div>
      </Link>
    </>
  );
};
const WorkMobile = () => {
  return (
    <section className="bg-[#FEFEFE] h-full w-screen px-[7vw] pt-[10%] pb-[15%] hidden max-sm:block " id="work-mobile">
      <div className="h-full w-full flex flex-col items-start justify-center space-y-[7vw]">
        {data.map((item, index) => (
          <WorkCard
            img={item.img}
            title={item.title}
            key={index}
            link={item.link}
          />
        ))}
       <div className="pl-[2vw]">
        <LinkButton
          text={"View All Projects"}
          href={"#"}
          hover={"text-white"}
          invert={true}
          className="text-[3.5vw] "
        />
       </div>
      </div>
    </section>
  );
};

export default WorkMobile;
