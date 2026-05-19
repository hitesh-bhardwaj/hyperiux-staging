import Awards from "@/components/About/Awards";
import Hero from "@/components/About/Hero";
import Intro from "@/components/About/Intro";
import SampleTeam from "@/components/About/SampleTeam";
import Values from "@/components/About/Values";
import WhatWeAre from "@/components/About/WhatWeAre";
import NewFaq from "@/components/Home/NewFaq";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
});

export default function Page() {
  return (
    <>
      <Layout>
        <Hero />
        <Intro />
        <Values />
        <WhatWeAre />
        <SampleTeam />
        <Awards />
        <NewFaq content={faqContent} />
        <Footer path={"/about"} pathName={"About Us"} />
      </Layout>
    </>
  );
}
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
