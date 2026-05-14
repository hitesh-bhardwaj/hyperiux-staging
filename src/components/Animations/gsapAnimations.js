/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import gsap from "gsap";
import { useEffect } from "react";



export function fadeUp() {
  // const router = useRouter();
  useEffect(() => {
      const ctx = gsap.context(() => {
        const content = document.querySelectorAll(".fadeup");
        content.forEach((content) => {
          gsap.set(content, { opacity: 0, y: 50 });
          gsap.to(content, {
            scrollTrigger: {
              trigger: content,
              start: "top 90%",
              // markers:true
            },
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 2,
          });
        });
      });
      return () => ctx.revert();
  }, []);
}

export function lineAnim() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const lineDraws = document.querySelectorAll(".lineDraw");
      lineDraws.forEach((lineDraw) => {
        gsap.from(lineDraw, {
          scrollTrigger: {
            trigger: lineDraw,
            start: "top 80%",
          },
          scaleX: 0,
          transformOrigin: "left",
          duration: 1,
          yPercent: 100,
          stagger: 0.07,
          ease: "power3.out",
        });
      });
    });
    return () => ctx.revert();
  }, []);
}


export function initMagneticButton() {
  const magnets = document.querySelectorAll('[data-magnetic-target]');

  if (window.innerWidth > 1024) {
    magnets.forEach((magnet) => {
      magnet.addEventListener('mousemove', moveMagnet);
      magnet.addEventListener('mouseleave', function (event) {
        const magneticInner = event.currentTarget.querySelector('.magnetic-inner');
        gsap.to(magneticInner, {
          x: 0,
          y: 0,
          duration: 1.4,
          ease: 'expo.out'
        });
      });
    });

    function moveMagnet(event) {
      const magnetButton = event.currentTarget;
      const bounding = magnetButton.getBoundingClientRect();
      const magnetsStrength = magnetButton.getAttribute('data-magnetic-strength');
      const magneticInner = magnetButton.querySelector('.magnetic-inner');
      const parentHasHover = magnetButton.parentElement.classList.contains('hover');
      
      const xMovement = ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) * magnetsStrength;
      const yMovement = ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) * magnetsStrength;

      if (parentHasHover) {
        gsap.to(magneticInner, {
          x: xMovement,
          y: yMovement,
          rotate: '0.001deg',
          duration: 1,
          ease: 'expo.out'
        });
      } else {
        gsap.to(magneticInner, {
          x: (event.clientX - bounding.left) - (bounding.width / 2),
          y: (event.clientY - bounding.top) - (bounding.height / 2),
          rotate: '0.001deg',
          duration: 1.4,
          ease: 'expo.out'
        });
      }
    }
  }
}