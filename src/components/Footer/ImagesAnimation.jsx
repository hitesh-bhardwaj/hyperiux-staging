'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap, Expo } from 'gsap';
import './base.css';

const MathUtils = {
  lerp: (a, b, n) => (1 - n) * a + n * b,
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
};

const ImagesAnimation = () => {
  const contentRef = useRef(null);
  const imagesRef = useRef([]);
  const [loadedImages, setLoadedImages] = useState(0);

  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const cacheMousePos = useRef({ x: 0, y: 0 });

  const zIndexVal = useRef(1);
  const imgPosition = useRef(0);
  const threshold = 100;

  const footerRef = useRef(null); // Track footer-cta bounds
  const isInsideFooter = useRef(false);

  const handleMouseMove = (ev) => {
    mousePos.current = { x: ev.clientX, y: ev.clientY };

    const footerEl = footerRef.current || document.querySelector('#footer-cta');
    if (footerEl) {
      const rect = footerEl.getBoundingClientRect();
      isInsideFooter.current =
        ev.clientX >= rect.left &&
        ev.clientX <= rect.right &&
        ev.clientY >= rect.top &&
        ev.clientY <= rect.bottom;
    }
  };

  const getMouseDistance = () => {
    const a = mousePos.current;
    const b = lastMousePos.current;
    return MathUtils.distance(a.x, a.y, b.x, b.y);
  };

  const showNextImage = () => {
    const img = imagesRef.current[imgPosition.current];
    if (!img) return;

    const rect = img.getBoundingClientRect();

    gsap.killTweensOf(img);
    gsap
      .timeline()
      .set(img, {
        startAt: { opacity: 1, scale: 0.2 },
        rotateZ: gsap.utils.random(-35, 35),
        scale: 0.2,
        zIndex: zIndexVal.current,
        x: cacheMousePos.current.x - rect.width / 2,
        y: cacheMousePos.current.y - rect.height / 2,
      })
      .to(img, {
        ease: Expo.easeOut,
        rotateZ: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        x: mousePos.current.x - rect.width / 2,
        y: mousePos.current.y - rect.height / 2,
      })
      .to(
        img,
        {
          ease: 'power4.inOut',
          opacity: 0,
          rotateZ: gsap.utils.random(-15, 15),
          duration: 0.7,
          delay: -0.7,
          scale: 0,
        },
      );
  };

  const render = () => {
    const distance = getMouseDistance();

    cacheMousePos.current.x = MathUtils.lerp(cacheMousePos.current.x, mousePos.current.x, 0.1);
    cacheMousePos.current.y = MathUtils.lerp(cacheMousePos.current.y, mousePos.current.y, 0.1);

    if (distance > threshold && isInsideFooter.current) {
      showNextImage();
      zIndexVal.current++;
      imgPosition.current = (imgPosition.current + 1) % imagesRef.current.length;
      lastMousePos.current = { ...mousePos.current };
    }

    const allInactive = imagesRef.current.every(
      (img) => !gsap.isTweening(img) && img.style.opacity === '0'
    );

    if (allInactive) {
      zIndexVal.current = 1;
    }

    requestAnimationFrame(render);
  };

  useEffect(() => {
    if (loadedImages === 20) {
      window.addEventListener('mousemove', handleMouseMove);
      render();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [loadedImages]);

  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };

  return (
    <>
      {/* Optional, but helpful to get the ref without relying on querySelector */}

      <div
        className="content"
        ref={contentRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
        }}
      >
        {[...Array(20)].map((_, i) => (
          <img
            key={i}
            className="content__img !w-[17vw] !h-[30vh] rounded-[0.7vw]"
            src={`/img/${i + 1}.png`}
            alt={`Trail ${i + 1}`}
            ref={(el) => {
              if (el) imagesRef.current[i] = el;
            }}
            onLoad={handleImageLoad}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0,
              pointerEvents: 'none',
              width: 'auto',
              height: 'auto',
              maxWidth: '300px',
            }}
          />
        ))}
      </div>
    </>
  );
};

export default ImagesAnimation;
