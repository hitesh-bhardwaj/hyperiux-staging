import Footer from "@/components/Footer";
import Blogs from "@/components/Home/BlogActive";
// import Blogs from "@/components/Home/BlogActive";
import BlogHorizontal from "@/components/Home/BlogHorizontal";
import ClientsGrid from "@/components/Home/ClientsGrid";
import ImageCursorFollower from "@/components/Home/ImageCursorFollower";
import Industries from "@/components/Home/Industries";
import Intro from "@/components/Home/Intro";
import NewFaq from "@/components/Home/NewFaq";
import SectionBreakSample from "@/components/Home/SectionBreakNoSquare";
// import SectionBreak from "@/components/Home/SectionBreak";
// import SectionBreakSample from "@/components/Home/SectionBreakSample";
import Testimonial from "@/components/Home/Testimonial";
import Work from "@/components/Home/WorkMain/WorkWithContent";
import React from "react";

const page = () => {
  return (
    <>
      <ImageCursorFollower
        src="/assets/images/black-pointer-new.png"
        pointerSrc="/assets/images/cursor-pointer-img.png"
        size={40}
        pointerSize={26}
        rotationOffset={90}
        followDuration={1.28}
        rotateDuration={1.24}
        minDistanceToRotate={3}
      />
      <Intro />
      <Work />
      {/* <SectionBreak/> */}
      <SectionBreakSample />
      <Industries />
      <ClientsGrid />
      <Testimonial />
      <Blogs/>
      <NewFaq content={faqContent} />
      <Footer path={"/about"} pathName={"About Us"} />
    </>
  );
};

export default page;

const faqContent = [
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM. Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM. Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM. Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM. Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Choosing between different options such as online banking, mobile apps, in-person transfers at a bank branch, or using a bank's ATM.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.Choosing between different options such as online banking.",
  },
];
