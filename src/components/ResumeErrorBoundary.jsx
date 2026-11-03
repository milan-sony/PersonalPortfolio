import { Component } from "react";
import ResumeUnavailable from "./ResumeUnavailable";

// Keeps a failed resume viewer from taking the whole page down with it
export default class ResumeErrorBoundary extends Component {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch() {
        this.props.onError?.();
    }

    render() {
        if (!this.state.failed) return this.props.children;

        const { file, downloadName, onClose } = this.props;
        return <ResumeUnavailable file={file} downloadName={downloadName} onClose={onClose} />;
    }
}
