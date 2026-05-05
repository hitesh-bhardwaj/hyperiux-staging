"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

export const LinkButton = ({
  text,
  href,
  className = "",
  hover,
  invert,
  ...props
}) => {
  const containerRef = useRef(null);
  const baseRef = useRef(null);
  const topRef = useRef(null);
  const characters = useMemo(
    () => text.split("").map((char) => (char === " " ? "\u00A0" : char)),
    [text]
  );

  const staggerValue = useMemo(() => {
    return Math.max(0.01, 0.018 * (10 / characters.length));
  }, [characters]);

  useEffect(() => {
    gsap.set(baseRef.current.querySelectorAll(".char"), {
      y: 15,
      rotateX: 90,
    });
    gsap.set(topRef.current.querySelectorAll(".char"), { y: 0, rotateX: 0 });
  }, []);

  const animateChars = (baseY, topY, rotateX, rotateX2) => {
    const baseChars = baseRef.current.querySelectorAll(".char");
    const topChars = topRef.current.querySelectorAll(".char");

    gsap.to(baseChars, {
      y: baseY,
      rotateX: rotateX,
      duration: 0.4,
      stagger: staggerValue,
      ease: "power2.out",
    });

    gsap.to(topChars, {
      y: topY,
      rotateX: rotateX2,
      duration: 0.4,
      stagger: staggerValue,
      ease: "power2.out",
    });
  };

  const handleMouseEnter = () => {
    animateChars(0, -15, 0, -90);
  };

  const handleMouseLeave = () => {
    animateChars(15, 0, 90, 0);
  };

  return (
    <>
      <Link
        scroll={false}
        href={href}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative inline-block h-fit w-fit  group cursor-pointer duration-500 ${hover ? "" : "hover:text-[#FF5F00]"} ${className}`}
      >
        <div
          ref={containerRef}
          style={{ perspective: "800px" }}
          className="relative flex flex-col items-start transform-origin-center"
        >
          {/* Bottom (Gray) Layer */}
          <div
            ref={baseRef}
            className="flex w-fit justify-between gap-[0.5vw] max-sm:gap-[2vw] max-sm:items-center  "
          >
            <div className="w-fit flex flex-col gap-[0.3vw]">
              <div className="w-fit flex h-fit overflow-hidden">
                {characters.map((char, i) => (
                  <span key={i} className="flex items-center justify-center">
                    <span className={`inline-block  char leading-[1.05] overflow-hidden transform-3d`}>
                      {char}
                    </span>
                  </span>
                ))}
              </div>
              <div className="h-px  group-hover:w-full duration-500 ease-[cubic-bezier(0.62,0.05,0.01,0.99)] origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform w-full bg-current rounded-full"></div>
            </div>
            <div className="w-[0.9vw] h-[0.8vw] mt-[0.1vw] flex flex-col flex-nowrap relative overflow-hidden max-sm:w-[2.5vw] max-sm:h-[2.5vw] max-sm:mt-0">
              <svg
                width="13"
                height="13"
                className="w-full h-full absolute group-hover:translate-y-[-100%] group-hover:translate-x-[100%] group-hover:scale-[0.5] duration-400 transition-all scale-[1]"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
                  fill="#1A1A1A"
                  className={`fill-current ${hover ? "" : "group-hover:fill-primary"} duration-300 `}
                />
              </svg>
              <svg
                width="13"
                height="13"
                className="w-full h-full absolute translate-y-[100%] translate-x-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 duration-400 transition-all scale-[0.5] group-hover:scale-[1]"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
                  fill="#1A1A1A"
                  className={`fill-current ${hover ? "" : "group-hover:fill-primary"} duration-300 `}
                />
              </svg>
            </div>
          </div>

          {/* Top (Red) Layer */}
          <div
            ref={topRef}
            className="absolute top-0 left-0 flex pointer-events-none"
          >
            {characters.map((char, i) => (
              <span key={i} className="">
                <span className="inline-block char overflow-hidden  font-sans leading-[1.05] font-normal transform-3d">
                  {char}
                </span>
              </span>
            ))}
          </div>
        </div>
      </Link>
    </>
  );
};

export const PrimaryButton = ({ text, href, className, invert, ...props }) => {
  // const { navigateTo } = useAnimatedNavigation();

  return (
    <>
      <Link
        scroll={false}
        href={href}
        // onClick={(e) => {
        //   e.preventDefault();
        //   navigateTo(href);
        // }}
        className="w-fit flex group hover:scale-[0.97] duration-400 ease-out relative z-[10]"
      >
        <div
          className={`w-fit relative h-full px-[3.5vw] overflow-hidden py-[0.7vw] rounded-full border border-white font-medium font-display ${className}`}
        >
          <span className="z-[1] relative">{text}</span>
          <span className="w-full h-full absolute bottom-0 left-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 duration-300 ease-out" />
        </div>
        <div
          className={`w-[3.5vw] h-[3.5vw] p-[1.1vw] relative rounded-full border border-white overflow-hidden ${className}`}
        >
          <span className="w-full h-full absolute bottom-0 left-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 duration-300 ease-out" />
          <Image
            src={"/assets/icons/arrow-diagonal.svg"}
            alt="arrow-diagonal"
            width={50}
            height={50}
            className={`w-full h-full object-contain group-hover:rotate-45 duration-300 ${invert ? "invert" : ""}`}
          />
        </div>
      </Link>
    </>
  );
};

export const MainButton = ({ btnText, link }) => {
  // const { navigateTo } = useAnimatedNavigation();

  return (
    <>
      <Link
        scroll={false}
        className={`${styles.cta} ${styles.dark}`}
        href={link}
        // onClick={(e) => {
        //   e.preventDefault();
        //   navigateTo(link);
        // }}
      >
        <span className={styles.ctaDot}></span>
        <span className={`${styles.ctaText} mt-[0.2vw]`}>{btnText}</span>
        <span className={styles.ctaArrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984"
            ></path>
          </svg>
        </span>
      </Link>
    </>
  );
};
export const WhiteButton = ({ btnText, link }) => {
  return (
    <>
      <Link
        className={`${styles.cta} ${styles.white} white-button `}
        href={link}
      >
        <span className={styles.ctaDot}></span>
        <span className={styles.ctaText}>{btnText}</span>
        <span className={styles.ctaArrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984"
            ></path>
          </svg>
        </span>
      </Link>
    </>
  );
};
export const WhiteNewButton = ({ btnText, link }) => {
  return (
    <>
      <Link className={`${styles.cta} ${styles.white}  `} href={link}>
        <span className={styles.ctaDot}></span>
        <span className={styles.ctaText}>{btnText}</span>
        <span className={styles.ctaArrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984"
            ></path>
          </svg>
        </span>
      </Link>
    </>
  );
};

export const Facebook = ({ className = "", menuSocial, fill }) => {
  const spanRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    if (spanRef.current) {
      spanRef.current.style.top = `${relY}px`;
      spanRef.current.style.left = `${relX}px`;
    }
  };

  return (
    <div
      className={`rounded-full overflow-hidden socials cursor-pointer hover:bg-white relative border border-black-1 w-fit h-fit group duration-300 ease-in-out ${menuSocial ? "menusocials" : ""}`}
      onMouseEnter={handleMouseMove}
      onMouseLeave={handleMouseMove}
    >
      <svg
        className={`${className} w-[2.8vw] h-[2.8vw] relative z-[2] duration-300 ease-in-out max-sm:w-[10vw] max-sm:h-[10vw] `}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2939_2713)">
          <path
            className={`duration-300 ease-in-out ${fill} `}
            d="M24.607 33.504C23.4341 33.504 22.2612 33.504 21.0883 33.504C21.0883 33.421 21.0765 33.338 21.0765 33.255C21.0765 30.492 21.0765 27.7291 21.0765 24.9661C21.0765 24.8831 21.0765 24.812 21.0765 24.7171C20.0813 24.7171 19.1098 24.7171 18.1383 24.7171C18.1383 23.5669 18.1383 22.4404 18.1383 21.2901C19.1216 21.2901 20.0931 21.2901 21.0765 21.2901C21.0765 21.1953 21.0765 21.1241 21.0765 21.0648C21.0765 20.3415 21.0646 19.6181 21.0765 18.9066C21.0883 18.4442 21.112 17.9817 21.2068 17.5311C21.5504 15.7642 22.8299 14.5784 24.607 14.3294C25.4719 14.2108 26.3249 14.2819 27.1898 14.3175C27.486 14.3294 27.794 14.3768 28.0902 14.4124C28.0902 15.4322 28.0902 16.4401 28.0902 17.4599C27.332 17.4718 26.5737 17.4599 25.8273 17.4955C25.2113 17.5192 24.8321 17.8513 24.6781 18.4204C24.6426 18.5627 24.6189 18.7169 24.6189 18.8592C24.607 19.63 24.607 20.4008 24.607 21.1715C24.607 21.2071 24.6189 21.2545 24.6307 21.3138C25.7444 21.3138 26.8581 21.3138 27.9836 21.3138C27.8414 22.4641 27.6874 23.5906 27.5452 24.729C26.5619 24.729 25.5904 24.729 24.6189 24.729C24.6189 24.8238 24.6189 24.8831 24.6189 24.9543C24.6189 27.7291 24.6189 30.5158 24.6189 33.2906C24.5952 33.3617 24.607 33.4329 24.607 33.504Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_2939_2713">
            <rect
              width="11"
              height="20"
              fill="currentColor"
              transform="translate(18 14)"
            />
          </clipPath>
        </defs>
      </svg>
      <span ref={spanRef}></span>
    </div>
  );
};

export const Instagram = ({ className = "", menuSocial, fill }) => {
  const spanRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    if (spanRef.current) {
      spanRef.current.style.top = `${relY}px`;
      spanRef.current.style.left = `${relX}px`;
    }
  };
  return (
    <div
      className={`rounded-full overflow-hidden socials cursor-pointer hover:bg-white relative border border-black-1 w-fit h-fit group hover:border-primary duration-300 ease-in-out ${menuSocial ? "menusocials" : ""}`}
      onMouseEnter={handleMouseMove}
      onMouseLeave={handleMouseMove}
    >
      <svg
        className={`${className} w-[2.8vw] h-[2.8vw] relative z-[2] duration-300 ease-in-out max-sm:w-[10vw] max-sm:h-[10vw]`}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2939_2714)">
          <path
            className={`duration-300 ease-in-out ${fill} `}
            d="M27.4336 23.5026C27.4336 24.1809 27.2325 24.844 26.8556 25.408C26.4788 25.972 25.9432 26.4115 25.3165 26.6711C24.6898 26.9307 24.0003 26.9986 23.335 26.8663C22.6697 26.7339 22.0586 26.4073 21.579 25.9277C21.0993 25.448 20.7727 24.8369 20.6404 24.1717C20.508 23.5064 20.576 22.8168 20.8355 22.1901C21.0951 21.5635 21.5347 21.0279 22.0987 20.651C22.6627 20.2742 23.3257 20.073 24.0041 20.073C24.9133 20.0741 25.785 20.4357 26.428 21.0787C27.0709 21.7216 27.4326 22.5933 27.4336 23.5026ZM34.7215 18.7869V28.2183C34.7197 29.8095 34.0868 31.335 32.9616 32.4602C31.8365 33.5853 30.3109 34.2182 28.7197 34.22H19.2884C17.6972 34.2182 16.1717 33.5853 15.0465 32.4602C13.9213 31.335 13.2884 29.8095 13.2866 28.2183V18.7869C13.2884 17.1957 13.9213 15.6702 15.0465 14.545C16.1717 13.4199 17.6972 12.787 19.2884 12.7852H28.7197C30.3109 12.787 31.8365 13.4199 32.9616 14.545C34.0868 15.6702 34.7197 17.1957 34.7215 18.7869ZM29.1484 23.5026C29.1484 22.4851 28.8467 21.4905 28.2814 20.6445C27.7162 19.7985 26.9127 19.1392 25.9727 18.7498C25.0327 18.3605 23.9983 18.2586 23.0004 18.4571C22.0025 18.6556 21.0859 19.1455 20.3664 19.865C19.647 20.5844 19.157 21.5011 18.9585 22.499C18.76 23.4969 18.8619 24.5312 19.2513 25.4713C19.6406 26.4113 20.3 27.2147 21.146 27.78C21.992 28.3452 22.9866 28.647 24.0041 28.647C25.368 28.6454 26.6755 28.1029 27.64 27.1385C28.6044 26.1741 29.1469 24.8665 29.1484 23.5026ZM30.8632 17.9295C30.8632 17.6752 30.7878 17.4265 30.6465 17.215C30.5051 17.0035 30.3043 16.8387 30.0693 16.7413C29.8343 16.644 29.5757 16.6185 29.3262 16.6681C29.0767 16.7178 28.8476 16.8403 28.6677 17.0201C28.4879 17.2 28.3654 17.4291 28.3157 17.6786C28.2661 17.9281 28.2916 18.1867 28.3889 18.4217C28.4863 18.6567 28.6511 18.8575 28.8626 18.9989C29.0741 19.1402 29.3228 19.2156 29.5771 19.2156C29.9182 19.2156 30.2453 19.0801 30.4865 18.8389C30.7277 18.5977 30.8632 18.2706 30.8632 17.9295Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_2939_2714">
            <rect
              width="22"
              height="23"
              fill="currentColor"
              transform="translate(13 12)"
            />
          </clipPath>
        </defs>
      </svg>
      <span ref={spanRef}></span>
    </div>
  );
};

export const Linkedin = ({ className = "", menuSocial, fill }) => {
  const spanRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    if (spanRef.current) {
      spanRef.current.style.top = `${relY}px`;
      spanRef.current.style.left = `${relX}px`;
    }
  };
  return (
    <div
      className={`rounded-full overflow-hidden socials cursor-pointer hover:bg-white relative border border-black-1 w-fit h-fit group hover:border-primary duration-300 ease-in-out ${menuSocial ? "menusocials" : ""}`}
      onMouseEnter={handleMouseMove}
      onMouseLeave={handleMouseMove}
    >
      <svg
        className={`${className} w-[2.8vw] h-[2.8vw] relative z-[2] duration-300 ease-in-out max-sm:w-[10vw] max-sm:h-[10vw]`}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2939_2717)">
          <path
            className={`duration-300 ease-in-out ${fill} `}
            d="M21.1284 32.6877C21.1284 28.8681 21.1284 25.0599 21.1284 21.2403C21.1284 21.1499 21.1284 21.0595 21.1284 20.9465C22.2924 20.9465 23.445 20.9465 24.6315 20.9465C24.6315 21.4663 24.6315 21.9862 24.6315 22.5173C24.8801 22.2235 25.0948 21.9297 25.3548 21.6811C25.9989 21.0708 26.7786 20.7544 27.6487 20.6753C28.4059 20.6075 29.163 20.664 29.8975 20.89C31.0954 21.2742 31.8412 22.1105 32.1576 23.297C32.3158 23.9072 32.3723 24.5514 32.474 25.1729C32.4966 25.2972 32.5079 25.4215 32.5192 25.5571C32.5192 27.9189 32.5192 30.292 32.5192 32.6538C31.3101 32.6538 30.0896 32.6538 28.8579 32.6538C28.8579 32.5521 28.8579 32.4617 28.8579 32.3826C28.8579 30.4389 28.8692 28.5065 28.8466 26.5628C28.8466 26.0882 28.7788 25.6023 28.6771 25.139C28.5415 24.5062 28.1686 24.0541 27.5018 23.9072C27.2306 23.8507 26.9481 23.8394 26.6656 23.862C25.7503 23.9298 25.1513 24.4158 24.9479 25.3085C24.8349 25.817 24.7784 26.3594 24.7784 26.8793C24.7558 28.8229 24.7671 30.7553 24.7671 32.699C23.5693 32.6877 22.3489 32.6877 21.1284 32.6877Z"
            fill="currentColor"
          />
          <path
            className={`duration-300 ease-in-out ${fill} `}
            d="M15.1946 32.6864C15.1946 30.2117 15.1946 27.7482 15.1946 25.2734C15.1946 23.9173 15.1946 22.55 15.1946 21.1939C15.1946 21.1148 15.1946 21.0357 15.1946 20.9453C16.415 20.9453 17.6129 20.9453 18.8446 20.9453C18.8446 21.0357 18.8446 21.1261 18.8446 21.2165C18.8446 25.0022 18.8446 28.7991 18.8446 32.5847C18.8446 32.6186 18.8446 32.6525 18.8446 32.6864C17.6355 32.6864 16.415 32.6864 15.1946 32.6864Z"
            fill="currentColor"
          />
          <path
            className={`duration-300 ease-in-out ${fill} `}
            d="M19.1267 17.2045C19.1041 18.4024 18.1322 19.3403 16.957 19.3064C15.8269 19.2838 14.8777 18.2894 14.9003 17.1367C14.9229 15.9841 15.906 15.0462 17.0587 15.0688C18.2226 15.1027 19.1493 16.0519 19.1267 17.2045Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_2939_2717">
            <rect
              width="19"
              height="18"
              fill="currentColor"
              transform="translate(14 15)"
            />
          </clipPath>
        </defs>
      </svg>
      <span ref={spanRef}></span>
    </div>
  );
};

export const Twitter = ({ className = "", menuSocial, fill }) => {
  const spanRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    if (spanRef.current) {
      spanRef.current.style.top = `${relY}px`;
      spanRef.current.style.left = `${relX}px`;
    }
  };
  return (
    <div
      className={`rounded-full overflow-hidden socials cursor-pointer hover:bg-white relative border border-black-1 w-fit h-fit group hover:border-primary duration-300 ease-in-out ${menuSocial ? "menusocials" : ""}`}
      onMouseEnter={handleMouseMove}
      onMouseLeave={handleMouseMove}
    >
      <svg
        className={`${className} w-[2.8vw] h-[2.8vw] relative z-[2] duration-300 ease-in-out max-sm:w-[10vw] max-sm:h-[10vw]`}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2939_2720)">
          <path
            className={`duration-300 ease-in-out ${fill} `}
            d="M15.0587 32.3472C15.447 31.8812 15.8353 31.4264 16.2347 30.9604C17.9543 28.9634 19.6739 26.9554 21.3935 24.9584C21.4268 24.914 21.4601 24.8697 21.5045 24.8253C19.3522 21.6967 17.211 18.5681 15.0476 15.4173C15.1142 15.4173 15.1475 15.4062 15.1918 15.4062C16.7339 15.4062 18.2871 15.4062 19.8292 15.4062C19.9402 15.4062 19.9956 15.4506 20.0511 15.5283C21.4157 17.5142 22.7692 19.4889 24.1338 21.4748C24.1671 21.5192 24.2004 21.5747 24.2448 21.6301C24.5221 21.3084 24.7995 20.9867 25.0657 20.676C26.5302 18.9786 27.9946 17.2812 29.448 15.5727C29.5478 15.4506 29.6587 15.4062 29.8141 15.4062C30.2135 15.4173 30.6128 15.4062 31.0566 15.4062C28.9931 17.8137 26.9406 20.1879 24.8993 22.5731C24.9326 22.6286 24.9659 22.673 24.9992 22.7174C27.1625 25.8681 29.3259 29.03 31.5004 32.1808C31.5337 32.2251 31.5559 32.2806 31.5891 32.3361C29.9472 32.3361 28.3052 32.3361 26.6633 32.3361C26.6411 32.3028 26.63 32.2695 26.6078 32.2362C25.1434 30.1283 23.69 28.0093 22.2367 25.8903C22.2145 25.857 22.1812 25.8238 22.1479 25.7794C22.0925 25.8349 22.0481 25.8903 22.0148 25.9347C20.8388 27.2993 19.6628 28.6639 18.4979 30.0285C17.8434 30.794 17.1777 31.5706 16.5231 32.3361C16.0239 32.3472 15.5358 32.3472 15.0587 32.3472ZM17.0335 16.5046C17.0779 16.5712 17.1 16.6155 17.1222 16.6488C20.506 21.4859 23.8786 26.323 27.2624 31.1712C27.3179 31.2599 27.3844 31.2932 27.4954 31.2932C28.1388 31.2932 28.7823 31.2932 29.4258 31.2932C29.4701 31.2932 29.5145 31.2821 29.5811 31.2821C29.5256 31.2045 29.4923 31.149 29.459 31.1046C26.985 27.5545 24.4999 24.0043 22.0259 20.4652C21.1383 19.2005 20.2508 17.9246 19.3633 16.6599C19.3189 16.6044 19.2412 16.5268 19.1858 16.5268C18.4757 16.5046 17.7768 16.5046 17.0335 16.5046Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_2939_2720">
            <rect
              width="17"
              height="18"
              fill="currentColor"
              transform="translate(15 15)"
            />
          </clipPath>
        </defs>
      </svg>

      <span ref={spanRef}></span>
    </div>
  );
};

export const Arrow = ({ className = "" }) => {
  return (
    <>
      <div className="w-full h-full mt-[-0.04vw] ml-[-0.04vw] flex flex-col flex-nowrap relative overflow-hidden ">
        <svg
          width="13"
          height="13"
          className="w-full h-full absolute group-hover:translate-y-[-100%] group-hover:translate-x-[100%] group-hover:scale-[0.5] duration-300 transition-all scale-[1]"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
            fill="#1A1A1A"
            className={`fill-current duration-300 `}
          />
        </svg>
        <svg
          width="13"
          height="13"
          className="w-full h-full absolute translate-y-[100%] translate-x-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 duration-300 transition-all scale-[0.5] group-hover:scale-[1]"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
            fill="#1A1A1A"
            className={`fill-current duration-300 `}
          />
        </svg>
      </div>
    </>
  );
};

// "use client";
// import React, { useRef, useEffect, useMemo } from "react";
// import gsap from "gsap";
// import Link from "next/link";

// export function TextAnimation({
//   text,
//   href,
//   className = "",
//   hover,
//   invert,
//   ...props
// }) {
//   const containerRef = useRef(null);
//   const baseRef = useRef(null);
//   const topRef = useRef(null);
//   const characters = useMemo(
//     () => text.split("").map((char) => (char === " " ? "\u00A0" : char)),
//     [text]
//   );

//   const staggerValue = useMemo(() => {
//     return Math.max(0.01, 0.018 * (10 / characters.length));
//   }, [characters]);

//   useEffect(() => {
//     gsap.set(baseRef.current.querySelectorAll(".char"), {
//       y: 15,
//       rotateX: 90,
//     });
//     gsap.set(topRef.current.querySelectorAll(".char"), { y: 0, rotateX: 0 });
//   }, []);

//   const animateChars = (baseY, topY, rotateX, rotateX2) => {
//     const baseChars = baseRef.current.querySelectorAll(".char");
//     const topChars = topRef.current.querySelectorAll(".char");

//     gsap.to(baseChars, {
//       y: baseY,
//       rotateX: rotateX,
//       duration: 0.6,
//       stagger: staggerValue,
//       ease: "power2.out",
//     });

//     gsap.to(topChars, {
//       y: topY,
//       rotateX: rotateX2,
//       duration: 0.6,
//       stagger: staggerValue,
//       ease: "power2.out",
//     });
//   };

//   const handleMouseEnter = () => {
//     animateChars(0, -15, 0, -90);
//   };

//   const handleMouseLeave = () => {
//     animateChars(15, 0, 90, 0);
//   };

//   return (
//     <>
//       <Link
//         scroll={false}
//         href={href}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         className={`relative inline-block h-fit  group cursor-pointer ${hover ? "" : "hover:text-primary"} ${className}`}
//       >
//         <div
//           ref={containerRef}
//           style={{ perspective: "800px" }}
//           className="relative flex flex-col items-start transform-origin-center mb-[.2vw]"
//         >
//           {/* Bottom (Gray) Layer */}
//           <div
//             ref={baseRef}
//             className="flex w-fit justify-between gap-[0.5vw]  "
//           >
//             <div className="w-fit flex flex-col gap-[0.3vw]">
//               <div className="w-fit flex h-fit overflow-hidden">
//                 {characters.map((char, i) => (
//                   <span key={i} className="flex items-center justify-center">
//                     <span className="inline-block  char leading-[1.05] overflow-hidden   text-[#1a1a1a] group-hover:text-[#FF6B00]  font-sans text- font-normal transform-3d">
//                       {char}
//                     </span>
//                   </span>
//                 ))}
//               </div>
//               <div className="!h-[1.2px]  group-hover:w-full duration-500 ease-[cubic-bezier(0.62,0.05,0.01,0.99)] origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform w-full group-hover:bg-[#FF6B00] bg-[#1a1a1a] rounded-full"></div>
//             </div>
//             <div className="w-[0.9vw] h-[0.8vw] mt-[0.2vw] flex flex-col flex-nowrap relative overflow-hidden max-sm:w-[3vw] max-sm:h-[3vw] ">
//               <svg
//                 width="13"
//                 height="13"
//                 className="w-full h-full absolute group-hover:translate-y-[-100%] group-hover:translate-x-[100%] group-hover:scale-[0.5] duration-500 transition-all scale-[1]"
//                 viewBox="0 0 13 13"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
//                   fill="#1A1A1A"
//                   className={`fill-current ${hover ? "" : "group-hover:fill-primary"} duration-300 `}
//                 />
//               </svg>
//               <svg
//                 width="13"
//                 height="13"
//                 className="w-full h-full absolute translate-y-[100%] translate-x-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 duration-500 transition-all scale-[0.5] group-hover:scale-[1]"
//                 viewBox="0 0 13 13"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
//                   fill="#1A1A1A"
//                   className={`fill-current ${hover ? "" : "group-hover:fill-primary"} duration-300 `}
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Top (Red) Layer */}
//           <div
//             ref={topRef}
//             className="absolute top-0 left-0 flex pointer-events-none"
//           >
//             {characters.map((char, i) => (
//               <span key={i} className="">
//                 <span className="inline-block char overflow-hidden  text-[#1a1a1a] group-hover:text-[#FF6B00]  font-sans leading-[1.05] font-normal transform-3d">
//                   {char}
//                 </span>
//               </span>
//             ))}
//           </div>
//         </div>
//       </Link>
//     </>
//   );
// }
