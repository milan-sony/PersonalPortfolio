import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Orbit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function PageNotFound() {
    const navigate = useNavigate();

    // Auto redirect after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="h-dvh w-full flex flex-col items-center justify-center bg-background text-center px-4 animate-in fade-in zoom-in duration-500">

            {/* Icon */}
            <div className="mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-muted rounded-2xl flex items-center justify-center">
                    <Orbit className="w-8 h-8 sm:w-10 sm:h-10 text-foreground animate-spin" />
                </div>
            </div>

            {/* 404 */}
            <h1 className="text-4xl sm:text-5xl font-black tracking-wide mb-2">
                404
            </h1>

            {/* Message */}
            <p className="text-sm sm:text-base text-muted-foreground mb-2 max-w-sm">
                Looks like you've lost the track
            </p>

            <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-sm">
                Redirecting you back to profile in 5 seconds...
            </p>

            {/* CTA */}
            <Link to="/">
                <Button className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Go to profile
                </Button>
            </Link>

        </div>
    );
}

export default PageNotFound;