const LETTER_MASK_URLS = ["h", "y", "p", "e", "r", "i", "u", "x"]
    .map((letter) => `url('/assets/icons/${letter}.svg')`)
    .join(", ");

const MASK_REPEAT = "no-repeat, ".repeat(8).slice(0, -2);
const MASK_SIZE = "10vw 10vw, ".repeat(8).slice(0, -2);
const MASK_POSITION =
    "0vw center, 12.5vw center, 25vw center, 37.5vw center, 50vw center, 59vw center, 68vw center, 80vw center";

export const HYPERIUX_LETTER_MASK_STYLE = {
    WebkitMaskImage: LETTER_MASK_URLS,
    maskImage: LETTER_MASK_URLS,
    WebkitMaskRepeat: MASK_REPEAT,
    maskRepeat: MASK_REPEAT,
    WebkitMaskSize: MASK_SIZE,
    maskSize: MASK_SIZE,
    WebkitMaskPosition: MASK_POSITION,
    maskPosition: MASK_POSITION,
};

export const MASK_OUTLINE_CHARS = [
    { src: "/assets/icons/h-outline.svg", left: "0vw" },
    { src: "/assets/icons/y-outline.svg", left: "12.5vw" },
    { src: "/assets/icons/p-outline.svg", left: "25vw" },
    { src: "/assets/icons/e-outline.svg", left: "37.5vw" },
    { src: "/assets/icons/r-outline.svg", left: "50vw" },
    { src: "/assets/icons/i-outline.svg", left: "59vw" },
    { src: "/assets/icons/u-outline.svg", left: "68vw" },
    { src: "/assets/icons/x-outline.svg", left: "80vw" },
];


export const CONTACT_LINKS = [
    {
        type: "email",
        href: "mailto:hi@hyperiux.com",
        label: "hi@hyperiux.com",
    },
    {
        type: "phone",
        href: "tel:+918178 026 136",
        label: "+91 8178 026 136",
    },
];



export const FOOTER_LINK_SECTIONS = [
    {
        title: "Company",
        className: "",
        links: [
            { text: "About", href: "#" },
            { text: "Work", href: "#" },
            { text: "Expertise", href: "#" },
            { text: "Career", href: "#" },
            { text: "Resources", href: "#" },
            { text: "Contact us", href: "#" },
        ],
    },
    {
        title: "Discover",
        className: "",
        links: [
            { text: "The Vault", href: "#" },
            { text: "Labs", href: "#" },
        ],
    },
];


export const SOCIAL_LINKS = [
    { href: "#", key: "facebook" },
    { href: "#", key: "twitter" },
    { href: "#", key: "linkedin" },
    { href: "#", key: "instagram" },
];
