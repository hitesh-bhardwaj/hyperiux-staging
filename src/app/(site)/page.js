import Blogs from "@/components/Home/BlogActive";
import ClientsGrid from "@/components/Home/ClientsGrid";
import Industries from "@/components/Home/Industries";
import Intro from "@/components/Home/Intro";
import NewFaq from "@/components/Home/NewFaq";
import SectionBreak from "@/components/Home/SectionBreak";
import Solutions from "@/components/Home/Solution/Solutions";
import WorkMobile from "@/components/Home/WorkMain/WorkMobile";
import Layout from "@/components/Layout";
import { Loader } from "@/components/Loader";
import { sanityFetch } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { HOMEPAGE_BLOGS_QUERY } from "@/sanity/queries/blog";
import dynamic from "next/dynamic";
import React from "react";

const Work = dynamic(
  () => import("@/components/Home/WorkMain/WorkWithContent"),
  {
    ssr: true,
  },
);
const Footer = dynamic(
  () => import("@/components/Footer"),
  {
    ssr: true,
  },
);
const Testimonial = dynamic(
  () => import("@/components/Home/Testimonial"),
  {
    ssr: true,
  },
);

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const page = async () => {
  const raw = await sanityFetch(HOMEPAGE_BLOGS_QUERY);
  const blogData = raw?.length
    ? raw.map((post) => ({
        title: post.title,
        slug: `/blog/${post.slug}`,
        image: post.coverImage ? urlFor(post.coverImage)?.width(700).height(500).quality(90).url() : null,
        category: post.category,
        publishedAt: post.publishedAt ? formatDate(post.publishedAt) : "",
      }))
    : undefined;

  return (
    <>
    <Layout>
      {/* <Loader/> */}
      <Intro />
      <Work />
      <WorkMobile/>
      <SectionBreak/>
      <Solutions/>
      <Industries />
      <ClientsGrid />
      <Testimonial />
      <Blogs blogData={blogData ?? undefined} />
      <NewFaq content={faqContent} />
      <Footer path={"/about"} pathName={"About Us"} />
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
