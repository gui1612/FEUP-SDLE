import { MainNav } from "@/src/components/nav/main-nav";
import { Footer } from "@/src/components/footer/footer";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Outlet } from "react-router-dom";
// import "./globals.css";

export default function Layout() {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <div className="flex-grow grid grid-cols-1 grid-rows-1">
                        <div>
                            <MainNav />
                            <Outlet />
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
