import Link from "next/link"
import { Facebook, Instagram, Linkedin, MainButton, Twitter } from "../Buttons"
import Copy from "../Animations/Copy"
import Image from "next/image"
import ImagesAnimation from "./ImagesAnimation"

export const CTA = () => {
    return (
        <div  className="w-full h-[80vh] px-[4vw] flex items-center justify-between pb-[2vw] relative z-[1000] overflow-hidden bg-[#f9f9f9]" id="footer-cta">
            <div  className="w-full text-black-1 flex flex-col items-center gap-[2vw] relative z-[500]">
                <Copy>
                    <p className="text-[5.7vw] leading-[1.2] font-display  mix-blend-color-burn w-[45%] text-center">
                        Let's bring your ideas to life!
                    </p>
                </Copy>
                <MainButton btnText={"Say Hi"} link={"#"}  />
            </div>
            <div className="w-full flex justify-between absolute px-[4vw] left-0 bottom-[2vw]">
               
                <div className="flex flex-col text-[1vw] w-[21%] font-medium gap-[0.4vw]">
                    <Link href={"mailto:hi@weareenigma.com"} className="link-line">hi@weareenigma.com</Link>
                    <Link href={"tel:+91 8745044555"} className="link-line">+91 8745044555</Link>
                </div>

                <div className="flex gap-[1vw]">
                   
                    <Facebook/>
                   <Twitter/>
                    <Linkedin/>
                    <Instagram/>
                </div>
                <div className="w-[20%] text-[1.1vw] font-medium">
                    Grandslam I-Thum, A-40, Sector- 62, Noida, Uttar Pradesh (201309)
                </div>
            </div>
            <div className="w-full h-full inset-0 absolute top-[-30%] left-0 z-[-1]">
                <ImagesAnimation />
            </div>
        </div>
    )
}