import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

// Opening the resume needs the viewer code, PDF.js and its worker, and the PDF
// itself, and then PDF.js has to read the PDF and convert its fonts before the
// first page can be drawn. Left alone, each step waits for the one before.
// Starting them here, the moment a visitor points at, focuses or touches the
// Resume button, runs the downloads side by side and gets the PDF read before
// the viewer has even opened. Everything is kept for the rest of the visit, so
// opening the resume a second time only has to draw it.

export const loadResumeViewer = () => import("@/components/ResumeViewer");

let worker = null;
let pdfjs = null;
const files = new Map();       // url -> Promise<ArrayBuffer>
const documents = new Map();   // url -> Promise<PDFDocumentProxy>

// One PDF.js worker for the whole visit
function getPdfWorker() {
    if (!worker && typeof Worker !== "undefined") {
        try {
            worker = new Worker(workerUrl, { type: "module" });
        } catch {
            worker = null;   // PDF.js then starts its own from workerSrc
        }
    }
    return worker;
}

// The legacy build also runs on older iPhones; the modern one needs features
// only the newest browsers have, such as Map.getOrInsertComputed
function loadPdfjs() {
    pdfjs ??= import("pdfjs-dist/legacy/build/pdf.mjs").then((module) => {
        module.GlobalWorkerOptions.workerSrc = workerUrl;
        const port = getPdfWorker();
        if (port) module.GlobalWorkerOptions.workerPort = port;
        return module;
    });
    return pdfjs;
}

function getResumeBytes(url) {
    if (!files.has(url)) {
        const pending = fetch(url).then((response) => {
            if (!response.ok) throw new Error(`Could not load ${url}`);
            return response.arrayBuffer();
        });
        pending.catch(() => files.delete(url));
        files.set(url, pending);
    }
    return files.get(url);
}

// The PDF, read and ready to draw. The first page's drawing instructions are
// prepared straight away too, which is where PDF.js converts the fonts, so
// that work is done in the background while the viewer is still loading.
export function getResumeDocument(url) {
    if (!documents.has(url)) {
        const pending = Promise.all([loadPdfjs(), getResumeBytes(url)])
            // PDF.js takes ownership of the bytes it is given, so it gets a copy
            .then(([{ getDocument }, bytes]) => getDocument({ data: new Uint8Array(bytes.slice(0)) }).promise);
        pending
            .then((doc) => doc.getPage(1))
            .then((page) => page.getOperatorList())
            .catch(() => { });
        // a failed attempt can be tried again on the next open
        pending.catch(() => documents.delete(url));
        documents.set(url, pending);
    }
    return documents.get(url);
}

export function prefetchResume(url) {
    loadResumeViewer();
    getResumeDocument(url).catch(() => { });
}
