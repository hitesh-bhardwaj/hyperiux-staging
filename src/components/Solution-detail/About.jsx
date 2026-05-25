"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MainButton } from "../Buttons";
gsap.registerPlugin(ScrollTrigger);


const About = () => {

  return (
     <section
            className="second-section-portal relative inset-0 z-3 h-[50vw] w-screen overflow-hidden bg-white  max-sm:mt-0 max-sm:h-[85vh] max-sm:opacity-100"
          >
        
            <div className=" relative pointer-events-none inset-0 z-30 flex h-full w-full items-center justify-end px-[5vw] max-sm:h-[80vh] max-sm:items-center max-sm:justify-center max-sm:px-[7vw]">
              <div className="pointer-events-auto w-[60%] text-[#111111] max-sm:w-full">
                <h2 className="second-split font-aeonik! text-[3.2vw] leading-none max-sm:pb-[5vw] max-sm:text-[10vw] max-sm:leading-[1.1]">
                  <div className="my-auto mr-[4vw] inline-block h-full translate-y-[-0.9vw] text-[1.2vw] text-black/50 max-sm:mr-[3vw] max-sm:block max-sm:translate-y-0 max-sm:pb-[6vw] max-sm:text-[3.5vw]">
                    Lorem ipsum
                  </div>
                 Human-Centered Digital Experiences
                </h2>
    
                <p className="second-split text-[1.4vw] mt-14  max-sm:mt-12 max-sm:w-full max-sm:text-[4.5vw]">
                    Leveraging the power of modern tools, understanding of human behavioural patterns and our unique approach, we transform your vision into visually appealing and functionally seamless digital experiences that users love to explore and engage with. By understanding the needs of your users and your business goals, we approach the design process with an emotionally balanced human-centric approach. 
                </p>
    
                <p className="second-split text-[1.4vw] mt-8  max-sm:mt-12 max-sm:w-full max-sm:text-[4.5vw]">
                  This enables us to deliver simple, stunning and user centric designs that engage your customers and boost your conversion rates as a by-product.
                </p>
    
                <div className="about-cta-btn mt-[3vw] h-fit w-fit max-sm:mt-[8vw] pointer-events-auto">
                  <MainButton href={"#"} btnText={"Book a Discovery Call"} />
                </div>
              </div>
            </div>
          </section>
  );
};

export default About;
