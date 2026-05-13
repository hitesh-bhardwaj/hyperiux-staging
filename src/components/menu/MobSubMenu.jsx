import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const MobSubMenu = ({ mobSubMenu, setMobSubMenu }) => {
  const [openSection, setOpenSection] = useState(null);
  //   console.log(subMenu);
  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  return (
    <div
      className={`w-[80%] h-full absolute left-[10%] top-[5%] duration-500 hidden max-sm:block ${mobSubMenu ? "opacity-100 pointer-events-auto delay-500" : "opacity-0 pointer-events-none"}`}
      id="mobsubmenu"
    >
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col gap-[3vw]">
          <div className="w-full flex gap-[5vw]">
            <div
              className="w-[5vw] h-auto"
              onClick={() => {
                setMobSubMenu(false);
              }}
            >
              <Image
                className="w-full h-full object-contain brightness-[20] rotate-[-135deg]"
                width={50}
                height={50}
                alt="arrow"
                src={"/assets/icons/arrow-right.svg"}
              />
            </div>
            <p className="text-white font-display text-[11vw]">Expertise</p>
          </div>
          <span className="w-full h-[1px] bg-white inline-block" />
        </div>
        <div className="w-full mt-[5vw]">
          {[
            {
              title: "Solutions",
              link: "/solutions",
              links: [
                { href: "#", text: "Design" },
                { href: "#", text: "Development" },
                { href: "#", text: "Marketing" },
                { href: "#", text: "Strategy" },
              ],
            },
            {
              title: "Industry",
              link: "/industries",
              links: [
                { href: "#", text: "Finance" },
                { href: "#", text: "HealthCare" },
                { href: "#", text: "Education" },
                {
                  href: "#",
                  text: "Inventory Management",
                },
                { href: "#", text: "Electronics" },
              ],
            },
          ].map((section, index) => (
            <div
              key={index}
              className={`flex w-full flex-col ${
                index % 3 >= 1 ? "" : "mt-[0.5vw]"
              }`}
            >
              <div
                className="flex justify-start gap-[4vw] w-full list-title cursor-pointer items-center font-display"
               
              >
                <a
                  href={section.link}
                  className="text-[7.5vw]"
                 
                >
                  {section.title}
                </a>
                <div
                 onClick={() => toggleSection(section.title)}
                  className={`w-fit h-fit  relative flex justify-center items-center mt-[1vw] `}
                >
                  <span className={`w-[4vw] h-[2px] rounded-full bg-white `} />
                  <span
                    className={`w-[4vw] h-[2px] rounded-full bg-white absolute transition-transform duration-700 ${
                      openSection === section.title ? "rotate-180" : "rotate-90"
                    }`}
                  />
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all ease-out duration-700 acc-height ${
                  openSection === section.title
                    ? section.title === "Solutions"
                      ? "h-[40vw] opacity-100"
                      : section.title === "Industry"
                        ? "h-[50vw] opacity-100"
                        : "h-0 opacity-0"
                    : "h-0 opacity-0"
                } `}
              >
                <ul className="max-sm:text-[5vw] max-md:text-[3.5vw] py-[2vw] pb-[7vw] pl-[0.4vw] flex flex-col items-start justify-center max-sm:gap-[1.5vw] max-md:gap-[1vw] font-display">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="link-line"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <Link href={"#"} className="text-[7.5vw] font-display">
          Services
        </Link>
      </div>
    </div>
  );
};

export default MobSubMenu;
