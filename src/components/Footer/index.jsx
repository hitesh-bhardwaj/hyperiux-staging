
import { NewFooterBottom } from "./NewFooterBottom";

export default function Footer({ pathName, path }) {
    return (
        <>
            <footer className="h-full w-full relative z-[22] dark" id="footer">
                <NewFooterBottom path={path} pathName={pathName} />
            </footer>
        </>
    )
}