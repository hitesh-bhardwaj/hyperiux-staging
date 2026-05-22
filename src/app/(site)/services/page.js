import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import React from "react";
import NewFaq from "@/components/Home/NewFaq";
import DesignProcessMob from "@/components/Services/DesignProcess/DesignProcessMob";
import DesignProcessMore from "@/components/Services/DesignProcess/DesignProcessMore";
import Hero from "@/components/Services/Hero";
import ApproachSlide from "@/components/Services/ApproachSlide";
import TextFillAnimation from "@/components/Services/TextFillAnimation";

const page = () => {
  return (
    <>
      <Layout>
        <div className="w-full h-[300vh]">
        <Hero />
        <TextFillAnimation
          text="We build intuitive experiences that feel human and perform globally."
          textSize="7vw"
          textWidth="100%"
          textColor="#111111"
          primaryColor="#ff6b00"
          dimColor="#AAAAAA"
          backgroundColor="#ffffff"
          id="hero-break"
          containerClassName=""
          mobileTextSize="8vw"
          mobileTextWidth="92%"
        />

        </div>
        <DesignProcessMob steps={steps} />
        <DesignProcessMore steps={steps} />
        <ApproachSlide />

        <NewFaq content={faqContent} />
        <Footer path={"/services"} pathName={"Services"} />
      </Layout>
    </>
  );
};

export default page;
const faqContent = [
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM. Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM. Choosing between different options such as online banking.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.",
  },
];

const steps = [
  {
    title: "What We Do",
    subtitle: "Design",
    linkCircle:"",
    arrowCol:"text-white",
    description:
      "For BSFI-Fintech brands, we offer full-funnel digital marketing solutions that power growth at every stage. By merging data-driven strategies with innovative creative execution, we optimize customer journeys, boost product adoption, and secure long-term success in a rapidly evolving digital ecosystem.",
    bgColor: "bg-[#215CFF]",
    serviceList:[
      "UI uX Design",
      "Ui ux audit",
      "wireframing"

    ],
    textColor: "text-white",
    containerClass: "container-1",
    contentClass: "container-1-content",
    imgContainerClass: "img-1-container",
    imgClass: "img-1",
    imgSize: "w-[25vw] h-[25vw]",
    imageSrc: "/assets/images/services/services-1-img.png",
  },
  {
    title: "What We Do",
    subtitle: "Development",
    description:
      "We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences that seamlessly connect the physical and digital worlds.",
    bgColor: "bg-[#FFE53F]",
    serviceList:[
      "UI uX Design",
      "Ui ux audit",
      "wireframing"

    ],
    textColor: "text-[#111111]",
    containerClass: "container-2",
    contentClass: "container-2-content",
    imgContainerClass: "img-2-container",
    imgClass: "img-2",
    imgSize: "w-[13vw] h-[13vw]",
    imageSrc: "/assets/images/services/services-2-img.png",
  },
  {
    title: "What We Do",
    subtitle: "Marketing",
    linkCircle:"bg-white",
    arrowCol:"text-white group-hover:text-[#ff5f00]",
    description:
      "We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences that seamlessly connect the physical and digital worlds.",
    bgColor: "bg-[#DE051F]",
    serviceList:[
      "UI uX Design",
      "Ui ux audit",
      "wireframing"

    ],
    textColor: "text-white",
    containerClass: "container-3",
    contentClass: "container-3-content",
    imgContainerClass: "img-3-container",
    imgClass: "img-3",
    imgSize: "w-[7vw] h-[7vw]",
    imageSrc: "/assets/images/services/services-3-img.png",
  },
  {
    title: "What We Do",
    subtitle: "Strategy",
    arrowCol:"text-white ",
    description:
      "We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences that seamlessly connect the physical and digital worlds.",
    bgColor: "bg-[#734eff]",
    serviceList:[
      "UI uX Design",
      "Ui ux audit",
      "wireframing"

    ],
    textColor: "text-white",
    containerClass: "container-4",
    contentClass: "container-4-content",
    imgContainerClass: "img-4-container",
    imgClass: "img-4",
    imgSize: "w-[7vw] h-[7vw]",
    imageSrc: "/assets/images/services/services-4-img.png",
  },
 
];
