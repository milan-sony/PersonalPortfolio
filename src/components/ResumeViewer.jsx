import { Download, Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TextLayer } from "pdfjs-dist/legacy/build/pdf.mjs";
import { pauseScroll, resumeScroll } from "@/lib/smooth-scroll";
import { getResumeDocument } from "@/lib/resume-prefetch";
import "./resume-viewer.css";

// This whole file is loaded only when someone opens the resume, so PDF.js
// never weighs on the first page load. Loading and reading the PDF happens in
// src/lib/resume-prefetch.js, which starts before the viewer opens.

const ZOOM_STEPS = [0.75, 1, 1.25, 1.5, 2];
const MAX_PAGE_WIDTH = 860;   // at 100% a page fills the panel up to this width
// room around the page inside the scroll area, matching .resume-pages padding;
// tighter on phones so the page keeps as much width as it can
const pagePadding = (width) => (width < 640 ? 20 : 32);
const MAX_CANVAS_PIXELS = 12_000_000;
// Past 2x, extra pixels cost drawing time on phones without looking sharper
const MAX_PIXEL_RATIO = 2;

// Draw one page onto a canvas. This is what the visitor waits for, so it comes
// first; the text layer and links are added once every page is showing.
async function drawPage(page, width, signal) {
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: width / base.width });
    // Sharp on high-density screens, but iPhones refuse canvases over about
    // 16 million pixels, so a zoomed page draws a little softer
    const area = viewport.width * viewport.height;
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO, Math.sqrt(MAX_CANVAS_PIXELS / area));

    const sheet = document.createElement("div");
    sheet.className = "resume-sheet";
    sheet.style.width = `${Math.floor(viewport.width)}px`;
    sheet.style.height = `${Math.floor(viewport.height)}px`;

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width * ratio);
    canvas.height = Math.floor(viewport.height * ratio);
    canvas.setAttribute("aria-hidden", "true");
    sheet.append(canvas);

    const task = page.render({
        canvas,
        canvasContext: canvas.getContext("2d"),
        viewport,
        transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
    });
    signal.addEventListener("abort", () => task.cancel(), { once: true });
    await task.promise;
    return signal.aborted ? null : { sheet, viewport };
}

// A transparent text layer over the canvas so the text can be selected and
// copied, and the PDF's own links as real links
async function addTextAndLinks(page, { sheet, viewport }, signal) {
    const text = document.createElement("div");
    text.className = "textLayer";
    text.style.setProperty("--total-scale-factor", viewport.scale);
    const textLayer = new TextLayer({ textContentSource: page.streamTextContent(), container: text, viewport });
    signal.addEventListener("abort", () => textLayer.cancel(), { once: true });
    await textLayer.render();
    if (signal.aborted) return;
    sheet.append(text);

    for (const annotation of await page.getAnnotations()) {
        const href = annotation.subtype === "Link" && annotation.url;
        if (!href || !/^(https?:|mailto:|tel:)/i.test(href)) continue;

        // the link's two corners, from PDF units to pixels on this page
        const [x1, y1] = viewport.convertToViewportPoint(annotation.rect[0], annotation.rect[1]);
        const [x2, y2] = viewport.convertToViewportPoint(annotation.rect[2], annotation.rect[3]);
        const link = document.createElement("a");
        link.className = "resume-link";
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", href.replace(/^mailto:|^tel:/i, ""));
        Object.assign(link.style, {
            left: `${Math.min(x1, x2)}px`,
            top: `${Math.min(y1, y2)}px`,
            width: `${Math.abs(x2 - x1)}px`,
            height: `${Math.abs(y2 - y1)}px`,
        });
        sheet.append(link);
    }
}

export default function ResumeViewer({ file, downloadName, onClose }) {
    const dialogRef = useRef(null);
    const scrollRef = useRef(null);
    const pagesRef = useRef(null);
    const [pdf, setPdf] = useState(null);
    const [status, setStatus] = useState("loading");   // loading, ready, error
    const [zoom, setZoom] = useState(1);
    const [areaWidth, setAreaWidth] = useState(0);
    const closingRef = useRef(false);

    // Open as a modal: the rest of the page goes inert, and focus returns to the
    // Resume button afterwards. Only the Close button closes it: Escape, the
    // Android back gesture and taps outside the panel are all ignored.
    useEffect(() => {
        const dialog = dialogRef.current;
        const focusClose = () => dialog.querySelector("[data-close]").focus();
        dialog.showModal();
        focusClose();
        document.body.style.overflow = "hidden";
        pauseScroll();

        const release = () => {
            document.body.style.overflow = "";
            resumeScroll();
        };

        // Escape and the back gesture arrive as a cancel event
        const keepOpen = (event) => event.preventDefault();

        // Chrome lets a dialog's cancel be blocked only once between clicks, and
        // closes it anyway after that, so anything other than the button reopens it
        const handleClose = () => {
            if (closingRef.current) {
                // give the page its scrolling back now; React may take a moment
                // to remove the dialog if a page is mid-draw
                release();
                return;
            }
            dialog.showModal();
            focusClose();
        };

        dialog.addEventListener("cancel", keepOpen);
        dialog.addEventListener("close", handleClose);

        return () => {
            dialog.removeEventListener("cancel", keepOpen);
            dialog.removeEventListener("close", handleClose);
            release();
        };
    }, []);

    // The PDF is usually already read by now, started from the Resume button.
    // It stays loaded after closing, so a second open only has to draw it.
    useEffect(() => {
        let cancelled = false;

        getResumeDocument(file).then(
            (doc) => {
                if (!cancelled) setPdf(doc);
            },
            () => {
                if (!cancelled) setStatus("error");
            },
        );

        return () => {
            cancelled = true;
        };
    }, [file]);

    // the pages are drawn to fit the panel, so redraw when it changes size
    useEffect(() => {
        const area = scrollRef.current;
        let timer;
        let first = true;
        const observer = new ResizeObserver(([entry]) => {
            const width = Math.floor(entry.contentRect.width);
            clearTimeout(timer);
            // the first size is needed straight away; later ones wait for a resize to settle
            if (first) {
                first = false;
                setAreaWidth(width);
            } else {
                timer = setTimeout(() => setAreaWidth(width), 120);
            }
        });
        observer.observe(area);
        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!pdf || !areaWidth) return;

        const holder = pagesRef.current;
        const controller = new AbortController();
        const width = Math.min(areaWidth - pagePadding(areaWidth), MAX_PAGE_WIDTH) * zoom;

        const { signal } = controller;

        (async () => {
            const drawn = [];
            for (let number = 1; number <= pdf.numPages; number++) {
                const page = await pdf.getPage(number);
                if (signal.aborted) return;
                const result = await drawPage(page, width, signal);
                if (!result) return;

                // Show each page the moment it is drawn. After a zoom, it takes
                // the place of the same page's old drawing, so nothing flashes empty.
                const old = holder.children[number - 1];
                if (old) old.replaceWith(result.sheet);
                else holder.append(result.sheet);
                if (number === 1) setStatus("ready");
                drawn.push([page, result]);
            }
            while (holder.children.length > pdf.numPages) holder.lastElementChild.remove();

            for (const [page, result] of drawn) {
                await addTextAndLinks(page, result, signal);
                if (signal.aborted) return;
            }
        })().catch(() => {
            if (!controller.signal.aborted) setStatus("error");
        });

        return () => controller.abort();
    }, [pdf, areaWidth, zoom]);

    const close = () => {
        closingRef.current = true;
        dialogRef.current.close();
        onClose();
    };

    const step = (direction) => {
        const index = ZOOM_STEPS.indexOf(zoom) + direction;
        if (index >= 0 && index < ZOOM_STEPS.length) setZoom(ZOOM_STEPS[index]);
    };

    const iconButton = "grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="resume-title"
            className="resume-dialog m-0 h-dvh border-0 max-h-none w-full max-w-none bg-transparent p-0 text-foreground backdrop:bg-black/50 backdrop:backdrop-blur-sm sm:p-6"
        >
            <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden border-border bg-card shadow-2xl sm:rounded-2xl sm:border">
                <header className="flex items-center gap-2 border-b border-border py-2 pl-5 pr-2">
                    <h2 id="resume-title" className="font-display mr-auto text-base font-medium">Resume</h2>

                    <div className="flex items-center" role="group" aria-label="Zoom">
                        <button type="button" className={iconButton} onClick={() => step(-1)} disabled={zoom === ZOOM_STEPS[0]} aria-label="Zoom out">
                            <Minus className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setZoom(1)}
                            // phones keep just - and +, so the bar stays uncluttered at 320px
                            className="hidden h-9 min-w-14 rounded-full px-2 text-sm tabular-nums sm:block text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            aria-label={`Zoom ${Math.round(zoom * 100)}%, reset to fit`}
                        >
                            {Math.round(zoom * 100)}%
                        </button>
                        <button type="button" className={iconButton} onClick={() => step(1)} disabled={zoom === ZOOM_STEPS.at(-1)} aria-label="Zoom in">
                            <Plus className="size-4" />
                        </button>
                    </div>

                    <a href={file} download={downloadName} className={iconButton} aria-label="Download resume">
                        <Download className="size-4" />
                    </a>
                    <button type="button" className={iconButton} onClick={close} aria-label="Close resume" data-close>
                        <X className="size-5" />
                    </button>
                </header>

                {/* data-lenis-prevent lets this panel scroll while the page's smooth scroll is paused.
                    The stable gutter keeps the width the same once a scrollbar appears, so a page
                    drawn to fit doesn't end up a scrollbar too wide. */}
                <div ref={scrollRef} data-lenis-prevent className="resume-scroll relative flex-1 overflow-auto overscroll-contain bg-muted">
                    <div ref={pagesRef} className="resume-pages" />

                    {status !== "ready" && (
                        <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted-foreground" role="status">
                            {status === "loading" ? (
                                <span className="flex items-center gap-3">
                                    <span className="live-dot" /> Loading the resume
                                </span>
                            ) : (
                                <span>
                                    The resume couldn't be shown here.{" "}
                                    <a href={file} download={downloadName} className="text-foreground underline underline-offset-4">Download it instead</a>.
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </dialog>
    );
}
