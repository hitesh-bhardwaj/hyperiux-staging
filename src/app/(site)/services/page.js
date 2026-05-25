import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import React from "react";
import NewFaq from "@/components/Home/NewFaq";
import DesignProcessMob from "@/components/Services/DesignProcess/DesignProcessMob";
import DesignProcessMore from "@/components/Services/DesignProcess/DesignProcessMore";
// import Hero from "@/components/Services/Hero";
import ApproachSlide from "@/components/Services/ApproachSlide";
import TextFillAnimation from "@/components/Services/TextFillAnimation";
import Hero from "@/components/Common/Hero";

const page = () => {
  return (
    <>
      <Layout>
        <div className="w-full h-fit">
        {/* <Hero /> */}
        <Hero title={"Creating Ambitious Brands"} para={"We are a globally recognised, award-winning UI UX design studio. Our comprehensive range of services leverages our full expertise to boost your digital presence to celestial heights."}/>
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
    question: "What is UX design, and why is it important for my website?",
    answer:
      "Choosing a UI UX design agency in India offers quality services at competitive pricing. We bring UX expertise combined with local market understanding, helping you achieve outstanding results.",
  },
  {
    question: "Why should I choose a UI UX design agency in India?",
    answer:
      "Yes, we provide UX design solutions tailored for both startups and large enterprises. Whether you’re launching a new product or enhancing an existing one, our team delivers innovative and scalable designs.",
  },
  {
    question: "Do you offer UX design services for startups and enterprises?",
    answer:
      "We follow a proven UX process: research, strategy, design, prototyping, and testing. Our team uses industry best practices and innovative tools to ensure every solution is user-centric and effective.",
  },
  {
    question: "How does Enigma Digital ensure high-quality UX design?",
    answer:
      "If your website feels outdated or struggles to convert users, we can help you with UX redesign services that improve usability, aesthetics, and business performance.",
  },
  {
    question: "Can you help with website UX redesign?",
    answer:
      "Absolutely. We design seamless user experiences for mobile apps, SaaS platforms, and e-commerce websites, helping businesses engage users and increase sales.",
  },
  {
    question: "Do you offer UI UX design for mobile apps and e-commerce platforms?",
    answer:
      "UI UX design costs vary based on project size, complexity, and scope. Enigma Digital offers affordable pricing tailored to your business needs. Contact us for a customised quote.",
  },
  {
    question: "How much do UI UX design services cost?",
    answer:
      "Yes, we offer comprehensive UX audits to identify usability issues and recommend improvements, helping businesses enhance their digital experiences.",
  },
  {
    question: "Does Hyperiux provide UX audits?",
    answer:
      "Hyperiux is a full-service UX/UI design company. We combine beautiful user interfaces (UI) with seamless user experiences (UX) to deliver exceptional digital products.",
  },
  {
    question: "Is Hyperiux a UX/UI design company or purely UX-focused?",
    answer:
      "Hyperiux is a leading UI/UX design agency with its head office in Noida, India. It specializes in user-centric UI/UX design services for business and consumer applications across multiple countries, including the USA, Canada, the Middle East, India, and beyond.",
  },
];

const steps = [
  {
    title: "What We Do",
    subtitle: "Design",
    linkCircle:"bg-white",
    arrowCol:"text-white group-hover:text-[#ff5f00]",
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
    bgColor: "bg-[#ff5f00]",
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
