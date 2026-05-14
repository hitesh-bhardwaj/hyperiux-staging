/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap/dist/gsap";

const VideoPlayer = ({ isOpen, onClose, videoSrc, poster }) => {
  const modalRef = useRef(null);
  const videoRef = useRef(null);
  const cursorRef = useRef(null);
  const videoWrapRef = useRef(null);
  const playBarRef = useRef(null);

  const rafRef = useRef(null);

  const mouseRef = useRef({
    x: 0,
    y: 0,
  });

  const cursorPosRef = useRef({
    x: 0,
    y: 0,
  });

  const isNearPlayBarRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!modalRef.current || !videoRef.current) return;

    if (isOpen) {
      gsap.to(modalRef.current, {
        autoAlpha: 1,
        zIndex: 910,
        duration: 0.5,
        ease: "power2.out",
      });

      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;

      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      gsap.to(modalRef.current, {
        autoAlpha: 0,
        zIndex: -1,
        duration: 0.5,
        ease: "power2.out",
      });

      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen, isMuted]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      const currentTime = videoElement.currentTime || 0;
      const duration = videoElement.duration || 0;

      if (!duration) {
        setProgress(0);
        return;
      }

      setProgress((currentTime / duration) * 100);
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const modal = modalRef.current;
    const videoWrap = videoWrapRef.current;
    const playBar = playBarRef.current;

    if (!cursor || !modal || !videoWrap || !playBar) return;

    const setInitialCursor = () => {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;

      mouseRef.current.x = x;
      mouseRef.current.y = y;
      cursorPosRef.current.x = x;
      cursorPosRef.current.y = y;

      gsap.set(cursor, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        transformOrigin: "center center",
      });
    };

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;

      const playBarRect = playBar.getBoundingClientRect();

      /*
        Near range around the play bar.
        Increase this if you want the cursor to hide earlier.
      */
      const safeArea = 70;

      const nearPlayBar =
        event.clientX >= playBarRect.left - safeArea &&
        event.clientX <= playBarRect.right + safeArea &&
        event.clientY >= playBarRect.top - safeArea &&
        event.clientY <= playBarRect.bottom + safeArea;

      if (nearPlayBar !== isNearPlayBarRef.current) {
        isNearPlayBarRef.current = nearPlayBar;

        gsap.to(cursor, {
          scale: nearPlayBar ? 0 : 1,
          duration: 0.35,
          ease: "power3.out",
          overwrite: true,
        });
      }
    };

    const animateCursor = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      /*
        Magnetic pull:
        cursor is attracted slightly toward the center of the video area,
        but still follows the mouse.
      */
      const wrapRect = videoWrap.getBoundingClientRect();
      const magneticCenterX = wrapRect.left + wrapRect.width / 2;
      const magneticCenterY = wrapRect.top + wrapRect.height / 2;

      const magneticStrength = 0.08;

      const magneticX =
        targetX + (magneticCenterX - targetX) * magneticStrength;
      const magneticY =
        targetY + (magneticCenterY - targetY) * magneticStrength;

      /*
        Lerp movement.
      */
      const lerp = 0.14;

      cursorPosRef.current.x += (magneticX - cursorPosRef.current.x) * lerp;
      cursorPosRef.current.y += (magneticY - cursorPosRef.current.y) * lerp;

      gsap.set(cursor, {
        x: cursorPosRef.current.x,
        y: cursorPosRef.current.y,
        xPercent: -50,
        yPercent: -50,
      });

      rafRef.current = requestAnimationFrame(animateCursor);
    };

    setInitialCursor();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = (e) => {
    e.stopPropagation();

    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMuteUnmute = (e) => {
    e.stopPropagation();

    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted((prev) => !prev);
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();

    if (!videoRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const duration = videoRef.current.duration || 0;

    if (!duration) return;

    const newTime = (offsetX / rect.width) * duration;
    videoRef.current.currentTime = newTime;
  };

  return (
    <div
      ref={modalRef}
      className="fixed left-0 top-0 z-[-1] flex h-full w-full cursor-none items-center justify-center opacity-0"
      onClick={onClose}
    >
      <div
        ref={videoWrapRef}
        className="relative h-full w-full cursor-none bg-black"
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          poster={poster}
          loop
          muted={isMuted}
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        <div
          ref={playBarRef}
          className="video-play-bar relative bottom-[10%] z-[5] mx-auto w-[70%] cursor-pointer p-4"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => {
            if (!cursorRef.current) return;

            isNearPlayBarRef.current = true;

            gsap.to(cursorRef.current, {
              scale: 0,
              duration: 0.35,
              ease: "power3.out",
              overwrite: true,
            });
          }}
          onMouseLeave={() => {
            if (!cursorRef.current) return;

            isNearPlayBarRef.current = false;

            gsap.to(cursorRef.current, {
              scale: 1,
              duration: 0.35,
              ease: "power3.out",
              overwrite: true,
            });
          }}
        >
          <div className="flex w-full items-center justify-between">
            <button
              onClick={handlePlayPause}
              className="w-[7.5%] text-white uppercase"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <div
              className="mt-[2px] h-[8px] w-[85%] cursor-pointer overflow-hidden rounded-[40px] bg-slate-800"
              onClick={handleProgressClick}
            >
              <div
                className="h-2 rounded-[40px] bg-white"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <button
              onClick={handleMuteUnmute}
              className="w-[7.5%] text-white uppercase"
            >
              {isMuted ? "Mute" : "Unmute"}
            </button>
          </div>
        </div>

        <div
          ref={cursorRef}
          className="magnetic-inner pointer-events-none fixed left-0 top-0 z-[20] flex h-[7vw] w-[7vw] items-center justify-center overflow-hidden rounded-full bg-[#ff5f00] p-[2vw]"
          id="cursor"
        >
          <span className="absolute h-[2.5px] w-[3vw] rotate-[-45deg] rounded-full bg-white" />
          <span className="absolute h-[2.5px] w-[3vw] rotate-[45deg] rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;