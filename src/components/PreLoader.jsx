export default function PreLoader() {
    return (
        <div
            className="h-dvh w-full flex flex-col items-center justify-center gap-5 bg-background px-4"
            role="status"
            aria-label="Loading"
        >

            <p className="font-display text-xl font-medium tracking-tight">
                MS
            </p>

            <div className="h-px w-24 overflow-hidden bg-border">
                <div className="loader-bar h-full w-full bg-signal" />
            </div>

        </div>
    );
}
