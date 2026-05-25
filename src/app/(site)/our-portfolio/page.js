import Hero from '@/components/Common/Hero'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'
import About from '@/components/Portfolio/About'
import Listing from '@/components/Portfolio/Listing'
import ListingGrid from '@/components/Portfolio/ListingGrid'
import ListingList from '@/components/Portfolio/ListingList'
import React from 'react'

const page = () => {
  return (
    <Layout>
        <div className='w-screen h-[200vh]'>
        <Hero title={"Our Work Showcase"} para={"We are a globally recognised, award-winning UI UX design studio. Our comprehensive range of services leverages our full expertise to boost your digital presence to celestial heights."}/>
        <About/>
        </div>
        {/* <ListingList/> */}
        {/* <ListingGrid/> */}
        <Listing/>
        <Footer/>
    </Layout>
  )
}

export default page