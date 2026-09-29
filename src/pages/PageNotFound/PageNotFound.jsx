import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignalLattice from "../../components/SignalLattice";

function PageNotFound() {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(5);

    // Auto redirect after 5 seconds
    useEffect(() => {
        if (seconds === 0) {
            navigate("/");
            return;
        }

        const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
        return () => clearTimeout(timer);
    }, [seconds, navigate]);

    return (
        <main className="relative isolate h-dvh w-full flex flex-col items-center justify-center overflow-hidden bg-background text-center px-4">

            <div className="absolute inset-0 -z-10 opacity-60">
                <SignalLattice />
            </div>

            {/* 404 */}
            <h1 className="font-display font-medium leading-none tracking-[-0.05em] text-[clamp(5rem,22vw,13rem)]">
                <span className="rise-line"><span>404</span></span>
            </h1>

            {/* Message */}
            <p className="fade-in mt-4 text-base sm:text-lg max-w-sm" style={{ "--delay": "300ms" }}>
                Looks like you've lost the track
            </p>

            <p className="fade-in mt-2 mb-8 text-sm text-muted-foreground max-w-sm tabular-nums" style={{ "--delay": "400ms" }}>
                Taking you back to the profile in {seconds} {seconds === 1 ? "second" : "seconds"}.
            </p>

            {/* CTA */}
            <Button size="lg" className="fade-in rounded-full px-6 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal" style={{ "--delay": "500ms" }} asChild>
                <Link to="/">
                    <ArrowLeft className="w-4 h-4" />
                    Go to profile
                </Link>
            </Button>

        </main>
    );
}

export default PageNotFound;
