import { useEffect, useRef } from "react";

const SPACING = 30;
const WAVE_SPEED = 240; // px per second
const WAVE_LIFE = 3.2; // seconds
const WAVE_WIDTH = 70;
const POINTER_RADIUS = 150;
const MAX_WAVES = 7;

// A grid of sensor dots. Pulses travel across it from the pointer,
// and a quiet one fires on its own every few seconds.
export default function SignalLattice({ className = "" }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const host = canvas.parentElement;
        const ctx = canvas.getContext("2d");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        let width = 0;
        let height = 0;
        let frame = 0;
        let running = false;
        let inView = true;
        let waves = [];
        let lastPointerWave = 0;
        let lastAmbientWave = 0;
        let colors = { dot: "", signal: "" };
        const pointer = { x: -9999, y: -9999, active: false };

        const readColors = () => {
            const styles = getComputedStyle(document.documentElement);
            colors = {
                dot: styles.getPropertyValue("--lattice").trim(),
                signal: styles.getPropertyValue("--signal").trim(),
            };
        };

        const resize = () => {
            const rect = host.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (!running) draw(performance.now());
        };

        const addWave = (x, y, strength, now) => {
            waves.push({ x, y, strength, born: now });
            if (waves.length > MAX_WAVES) waves.shift();
        };

        const draw = (now) => {
            ctx.clearRect(0, 0, width, height);

            const offsetX = (width % SPACING) / 2;
            const offsetY = (height % SPACING) / 2;
            const lit = [];

            ctx.fillStyle = colors.dot;
            for (let x = offsetX; x <= width; x += SPACING) {
                for (let y = offsetY; y <= height; y += SPACING) {
                    let energy = 0;
                    let pushX = 0;
                    let pushY = 0;

                    for (const wave of waves) {
                        const age = (now - wave.born) / 1000;
                        const dx = x - wave.x;
                        const dy = y - wave.y;
                        const dist = Math.hypot(dx, dy) || 1;
                        const gap = Math.abs(dist - age * WAVE_SPEED);
                        if (gap > WAVE_WIDTH) continue;

                        const fade = 1 - age / WAVE_LIFE;
                        const hit = (1 - gap / WAVE_WIDTH) ** 2 * fade * wave.strength;
                        energy += hit;
                        pushX += (dx / dist) * hit * 5;
                        pushY += (dy / dist) * hit * 5;
                    }

                    if (pointer.active) {
                        const dist = Math.hypot(x - pointer.x, y - pointer.y);
                        if (dist < POINTER_RADIUS) {
                            energy += (1 - dist / POINTER_RADIUS) ** 2 * 0.9;
                        }
                    }

                    if (energy > 0.02) {
                        lit.push(x + pushX, y + pushY, Math.min(energy, 1));
                    } else {
                        ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
                    }
                }
            }

            ctx.fillStyle = colors.signal;
            for (let i = 0; i < lit.length; i += 3) {
                const energy = lit[i + 2];
                ctx.globalAlpha = 0.25 + energy * 0.75;
                ctx.beginPath();
                ctx.arc(lit[i], lit[i + 1], 0.9 + energy * 1.7, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        };

        const tick = (now) => {
            if (!running) return;

            waves = waves.filter((wave) => (now - wave.born) / 1000 < WAVE_LIFE);

            if (now - lastAmbientWave > 3400) {
                lastAmbientWave = now;
                addWave(
                    width * (0.15 + Math.random() * 0.7),
                    height * (0.15 + Math.random() * 0.7),
                    0.55,
                    now
                );
            }

            draw(now);
            frame = requestAnimationFrame(tick);
        };

        const start = () => {
            if (running || reducedMotion.matches || !inView || document.hidden) return;
            running = true;
            lastAmbientWave = performance.now() - 2600;
            frame = requestAnimationFrame(tick);
        };

        const stop = () => {
            running = false;
            cancelAnimationFrame(frame);
        };

        const onPointerMove = (event) => {
            const rect = host.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
            pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
            if (!pointer.active) return;

            const now = performance.now();
            if (running && now - lastPointerWave > 420) {
                lastPointerWave = now;
                addWave(pointer.x, pointer.y, 1, now);
            }
        };

        const onPointerLeave = () => {
            pointer.active = false;
        };

        const onVisibility = () => (document.hidden ? stop() : start());

        const onMotionChange = () => {
            if (reducedMotion.matches) {
                stop();
                waves = [];
                pointer.active = false;
                draw(performance.now());
            } else {
                start();
            }
        };

        const themeObserver = new MutationObserver(() => {
            readColors();
            if (!running) draw(performance.now());
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-season"] });

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        const viewObserver = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            if (inView) start();
            else stop();
        });
        viewObserver.observe(host);

        // the canvas sits behind the hero content, so track the pointer on the window
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onPointerLeave);
        document.addEventListener("visibilitychange", onVisibility);
        reducedMotion.addEventListener("change", onMotionChange);

        readColors();
        resize();
        start();

        return () => {
            stop();
            themeObserver.disconnect();
            resizeObserver.disconnect();
            viewObserver.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            document.documentElement.removeEventListener("pointerleave", onPointerLeave);
            document.removeEventListener("visibilitychange", onVisibility);
            reducedMotion.removeEventListener("change", onMotionChange);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full ${className}`}
        />
    );
}
