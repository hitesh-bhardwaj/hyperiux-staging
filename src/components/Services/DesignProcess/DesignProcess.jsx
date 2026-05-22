// 'use client'
// import React, { useEffect, useState } from 'react'
// import DesignProcessMore from './DesignProcessMore'


// const DesignProcess = () => {
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth <= 640) 
//     }

//     checkScreenSize() 
//     window.addEventListener('resize', checkScreenSize)

//     return () => {
//       window.removeEventListener('resize', checkScreenSize)
//     }
//   }, [])

//   return (
//    <DesignProcessMore steps={steps} sample={sample} />
//   )
// }

// export default DesignProcess
// const sample =[1,2,3,4,5,6,7]
// const steps = [
//   {
//     title: "Design Process",
//     subtitle: "Discover",
//     description:
//       "We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences that seamlessly connect the physical and digital worlds.",
//     bgColor: "bg-[#215CFF]",
//     textColor: "text-white",
//     containerClass: "container-1",
//     contentClass: "container-1-content",
//     imgContainerClass: "img-1-container",
//     imgClass: "img-1",
//     imgSize: "w-[30vw] h-[25vw]",
//     imageSrc: "/assets/images/solution-detail/all-services/services-1-img.png",
//   },
//   {
//     title: "Design Process",
//     subtitle: "Discover",
//     description:
//       "We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences that seamlessly connect the physical and digital worlds.",
//     bgColor: "bg-[#FFEA47]",
//     textColor: "text-black-1",
//     containerClass: "container-2",
//     contentClass: "container-2-content",
//     imgContainerClass: "img-2-container",
//     imgClass: "img-2",
//     imgSize: "w-[13vw] h-[15vw]",
//      imageSrc: "/assets/images/solution-detail/all-services/services-2-img.png",
//   },
//   {
//     title: "Design Process",
//     subtitle: "Discover",
//     description:
//       "We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences that seamlessly connect the physical and digital worlds.",
//     bgColor: "bg-[#ff6b00]",
//     textColor: "text-white",
//     containerClass: "container-3",
//     contentClass: "container-3-content",
//     imgContainerClass: "img-3-container",
//     imgClass: "img-3",
//     imgSize: "w-[7vw] h-[8vw]",
//      imageSrc: "/assets/images/solution-detail/all-services/services-3-img.png",
//   },
//   {
//     title: "Design Process",
//     subtitle: "Discover",
//     description:
//       "We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences that seamlessly connect the physical and digital worlds.",
//     bgColor: "bg-[#9FF86F]",
//     textColor: "text-black-1",
//     containerClass: "container-4",
//     contentClass: "container-4-content",
//     imgContainerClass: "img-4-container",
//     imgClass: "img-4",
//     imgSize: "w-[7vw] h-[8vw]",
//     imageSrc: "/assets/images/solution-detail/all-services/services-4-img.png",
//   },
//   {
//     title: "Design Process",
//     subtitle: "Discover",
//     description:
//       "We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences that seamlessly connect the physical and digital worlds.",
//     bgColor: "bg-[#734EFF]",
//     textColor: "text-white",
//     containerClass: "container-5",
//     contentClass: "container-5-content",
//     imgContainerClass: "img-5-container",
//     imgClass: "img-5",
//     imgSize: "w-[7vw] h-[8vw]",
//      imageSrc: "/assets/images/solution-detail/all-services/services-5-img.png",
//   },
//   {
//     title: "Design Process",
//     subtitle: "Discover",
//     description:
//       "We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences that seamlessly connect the physical and digital worlds.",
//     bgColor: "bg-[#FF3861]",
//     textColor: "text-white",
//     containerClass: "container-6",
//     contentClass: "container-6-content",
//     imgContainerClass: "img-6-container",
//     imgClass: "img-6",
//     imgSize: "w-[7vw] h-[8vw]",
//      imageSrc: "/assets/images/solution-detail/all-services/services-6-img.png",
//   },
// ];


