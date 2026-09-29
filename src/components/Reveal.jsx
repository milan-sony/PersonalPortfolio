import { useEffect, useRef, useState } from "react";

// Fades its children in the first time they scroll into view
export default function Reveal({ as = "div", delay = 0, className = "", children, ...props }) {
    const Tag = as;
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal ${visible ? "is-visible" : ""} ${className}`}
            style={{ "--delay": `${delay}ms` }}
            {...props}
        >
            {children}
        </Tag>
    );
}
