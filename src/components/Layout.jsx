import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <div className="min-h-dvh flex flex-col bg-background">

            <Navbar />

            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}