import Footer from '@/components/Footer'
import Blogs from '@/components/Home/BlogActive'
import ClientsGrid from '@/components/Home/ClientsGrid'
import Industries from '@/components/Home/Industries'
import Intro from '@/components/Home/Intro'
import NewFaq from '@/components/Home/NewFaq'
import SectionBreakSample from '@/components/Home/SectionBreakSample'
import Testimonial from '@/components/Home/Testimonial'
import Work from '@/components/Home/WorkMain/WorkWithContent'
import React from 'react'

const page = () => {
  return (
    <>
    <Intro/>
    <Work/>
    <SectionBreakSample/>
    {/* <IndustrySample/> */}
    <Industries/>
    <ClientsGrid/>
    <Testimonial/>
    <Blogs/>
    <NewFaq content={faqContent} />
    <Footer path={"/about"} pathName={"About Us"} />
    
    </>
  )
}

export default page

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