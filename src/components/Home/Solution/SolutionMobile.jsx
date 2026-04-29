import { LinkButton } from "@/components/Buttons";
import HeadAnim from "@/components/Animations/HeadAnim";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const SolutionMobile = () => {
  const serviceData = [
    {
      id: "01",
      title: "Development",
      bgClass: "bg-[#ffea47]",
      arrowColor:"bg-black-1",
      textClass: "text-black-1",
      description:
        "Dive into a world where design meets strategy, only at Creative Curve. Our creative designing services are more than just aesthetics; they're about telling a compelling story. We understand the power of design in shaping perceptions and influencing decisions. Our offerings span both offline and online mediums.",
    },
    {
      id: "02",
      title: "Design",
      bgClass: "bg-[#734eff]",
       arrowColor:"bg-white",
      textClass: "text-white",
      description:
        "Our Public Relations services are not just about getting your brand in the news; they're about crafting the right narrative and building enduring relationships. We recognize the importance of a brand's reputation and work diligently to enhance and protect it. Our seasoned PR professionals bridge the gap between your brand and the world, ensuring your story is told the way it should be. Navigate the intricate maze of media relations with Creative Curve's tailored solutions.",
    },
    {
      id: "03",
      title: "Marketing",
      bgClass: "bg-[#215CFF]",
       arrowColor:"bg-white",
      textClass: "text-white",
      description:
        "Step into the realm of compelling storytelling. We believe in the power of sight and sound to evoke emotions and drive actions. Our team & partner network of skilled videographers, sound engineers, and editors craft content that resonates, whether it's a brand film or a corporate documentary. Experience the magic of audio-visual like never before.",
    },
    {
      id: "04",
      title: "Strategy",
      bgClass: "bg-[#ff6b00]",
       arrowColor:"bg-white",
      textClass: "text-white",
      description:
        "Embark on a digital journey where innovation meets impact. Our Digital Marketing services are tailored to navigate the ever-evolving online landscape. We harness the latest tools and trends to ensure your brand not only has a robust online presence but also engages and converts its audience. Dive deep into the digital realm with us.",
    },
  ];

  return (
    <div
      className="w-screen py-[15%] px-[7vw] max-sm:flex flex-col gap-[8vw] hidden h-fit"
      id="solutions"
    >
      {/* <Copy> */}
      <HeadAnim>
        <h2 className="text-[11vw] uppercase">
          explore <br /> our solutions
        </h2>
      </HeadAnim>

      {/* </Copy> */}

      <Accordion type="single" collapsible className="space-y-[4vw]">
        {serviceData.map((service) => (
          <AccordionItem
            key={service.id}
            bg={service.bgClass}
            value={service.id}
            className={
              // base + make children react to open state
              `fadeUp rounded-[5vw] pl-[7vw] pr-[4vw] py-[3vw] transition-colors duration-300 group ${service.bgClass}  ${service.textClass} `
            }
          >
            <AccordionTrigger
            arrowColor={service.arrowColor}
              className={
                // inherit text color from parent (when open)
                "flex flex-1 items-start justify-between text-[7vw] font-aeonik transition-colors duration-300"
              }
            >
              {service.title}
            </AccordionTrigger>

            <AccordionContent className="text-[4.5vw] transition-colors duration-300">
              <p>{service.description}</p>

              <div className="gap-y-[3vw] flex flex-col pt-[10vw] pb-[7vw]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Link
                    key={i}
                    href="#"
                    data-split="letters"
                    data-letters-delay
                    className={
                      "w-[90%] h-[7vw] relative links solutions-link buttonSplit transition-colors duration-300"
                    }
                  >
                    <div className="overflow-clip">
                      <p className="text-[3.2vw] font-medium uppercase buttonTextShadow">
                        User Interface Design
                      </p>
                    </div>
                  </Link>
                ))}
                <LinkButton
                  text={"Learn More"}
                  href={"#"}
                  className="text-[4vw] mt-[7vw]"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default SolutionMobile;
