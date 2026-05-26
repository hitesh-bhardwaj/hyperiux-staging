import { PageTransitionProvider } from "@/components/Animations/PageTransitionProvider";
import LenisProvider from "@/components/LenisProvider";

export default function SiteLayout({ children }) {
  return (
    <LenisProvider>
      <PageTransitionProvider>
        {children}
        </PageTransitionProvider>
    </LenisProvider>
  );
}
