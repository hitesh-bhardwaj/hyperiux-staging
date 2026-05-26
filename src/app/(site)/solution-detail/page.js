import Hero from '@/components/Common/Hero'
import Layout from '@/components/Layout'
import TextFillAnimation from '@/components/Services/TextFillAnimation'
import About from '@/components/Solution-detail/About'
import React from 'react'
import { Footer } from "@/components/EnhancedFooter/Footer";


const page = () => {
  return (
    <Layout>
        <div className='w-screen h-[200vh]'>
        <Hero title={"DEVELOPMENT"} para={"We seamlessly blend physical and digital worlds to craft exceptional experiences that boost revenue, conversions, and loyalty. We seamlessly blend physical and digital worlds to craft exceptional experiences that boost revenue, conversions, and loyalty."}/>
        <About/>
        <TextFillAnimation
                  text="We craft emotionally intelligent user experiences that are adored globally!"
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
                <Footer progressTitle={"About"} progressRoute={"/about"}/>
        
        

        </div>
    </Layout>
  )
}

export default page