import { MainNav } from "@/components/nav/main-nav";
import { Footer } from "@/components/footer/footer";
import { ThemeProvider } from "@/components/theme-provider";
// import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <div className="flex-grow grid grid-cols-1 grid-rows-1">
                        <div>
                            <MainNav />
                            {children}
                        </div>
                    </div>
                    <div>
                        <Footer />
                    </div>
                </ThemeProvider>
            </div>
        </>
    );
}
