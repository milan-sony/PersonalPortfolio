import { useEffect, useRef } from "react";
import { Download, ExternalLink } from "lucide-react";

// Shown when the viewer can't load, for example on a dropped connection, or
// when the page was open during a deploy and the viewer file it asks for has
// since been replaced. The PDF itself always lives at the same address, so it
// can still be opened or saved directly.
export default function ResumeUnavailable({ file, downloadName, onClose }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();
        return () => {
            if (dialog.open) dialog.close();
        };
    }, []);

    const action = "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium transition-colors";

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="resume-error-title"
            onClose={onClose}
            className="m-auto w-[min(26rem,calc(100%-2.5rem))] rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        >
            <h2 id="resume-error-title" className="font-display text-base font-medium">Couldn't open the resume</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The viewer didn't load. You can open the PDF in a new tab or download it instead.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <a href={file} target="_blank" rel="noopener noreferrer" className={`${action} bg-primary text-primary-foreground hover:bg-primary/90`}>
                    <ExternalLink className="size-4" /> Open the PDF
                </a>
                <a href={file} download={downloadName} className={`${action} border border-border hover:bg-accent`}>
                    <Download className="size-4" /> Download
                </a>
                <button type="button" onClick={() => dialogRef.current.close()} className={`${action} text-muted-foreground hover:text-foreground sm:ml-auto`}>
                    Close
                </button>
            </div>
        </dialog>
    );
}
