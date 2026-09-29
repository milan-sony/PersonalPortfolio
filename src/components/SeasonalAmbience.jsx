import { useEffect, useRef } from "react";
import { useSeason } from "@/lib/season-context";

const BASE_AREA = 1440 * 900;
const EDGE = 40;

const between = ([min, max]) => min + Math.random() * (max - min);

// Whatever is in the air this season: petals, dust on a dry wind, rain, leaves,
// mist or snow. Sits behind the page content and never takes pointer events.
export default function SeasonalAmbience() {
    const canvasRef = useRef(null);
    const { season } = useSeason();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const { drift, rain, fog } = season.ambience;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        let width = 0;
        let height = 0;
        let dpr = 1;
        let frame = 0;
        let last = 0;
        let running = false;
        let drifters = [];
        let drops = [];
        let banks = [];
        let signal = "";

        const sprites = (drift?.sprites ?? []).map((src) => {
            const image = new Image();
            image.src = src;
            return image;
        });

        const readColors = () => {
            signal = getComputedStyle(document.documentElement).getPropertyValue("--signal").trim();
        };

        const spawnDrifter = (anywhere) => {
            const vy = between(drift.vy);
            const vx = between(drift.vx);
            let x = Math.random() * width;
            let y = Math.random() * height;

            // new arrivals come in from the edge they are being carried away from
            if (!anywhere) {
                if (Math.abs(vx) > Math.abs(vy) * 2) x = vx > 0 ? -EDGE : width + EDGE;
                else y = vy > 0 ? -EDGE : height + EDGE;
            }

            return {
                x, y, vx, vy,
                sprite: sprites[Math.floor(Math.random() * sprites.length)],
                size: between(drift.size),
                alpha: between(drift.alpha),
                sway: between(drift.sway),
                swaySpeed: 0.4 + Math.random() * 0.8,
                phase: Math.random() * Math.PI * 2,
                rotation: Math.random() * Math.PI * 2,
                spin: between(drift.spin),
            };
        };

        const spawnDrop = (anywhere) => {
            const vy = between(rain.vy);
            return {
                // the slant carries drops sideways, so some start past the far edge
                x: Math.random() * (width + height * Math.abs(rain.slant)),
                y: anywhere ? Math.random() * height : -EDGE,
                vx: vy * rain.slant,
                vy,
                length: between(rain.length),
                alpha: between(rain.alpha),
            };
        };

        const populate = () => {
            const scale = Math.min(Math.max((width * height) / BASE_AREA, 0.45), 1.6);

            drifters = drift
                ? Array.from({ length: Math.round(drift.density * scale) }, () => spawnDrifter(true))
                : [];

            drops = rain
                ? Array.from({ length: Math.round(rain.density * scale) }, () => spawnDrop(true))
                : [];

            banks = fog
                ? Array.from({ length: 5 }, (_, i) => ({
                    x: Math.random() * width,
                    y: height * (0.2 + 0.18 * i),
                    radius: 220 + Math.random() * 260,
                    vx: 8 + Math.random() * 14,
                }))
                : [];
        };

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            populate();
        };

        const isOutside = (p) =>
            p.y > height + EDGE * 2 || p.y < -EDGE * 2 || p.x > width + EDGE * 2 || p.x < -EDGE * 2;

        const drawFog = (dt) => {
            ctx.globalAlpha = 0.07;
            for (const bank of banks) {
                bank.x += bank.vx * dt;
                if (bank.x - bank.radius > width) bank.x = -bank.radius;

                const gradient = ctx.createRadialGradient(bank.x, bank.y, 0, bank.x, bank.y, bank.radius);
                gradient.addColorStop(0, signal);
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.fillRect(bank.x - bank.radius, bank.y - bank.radius, bank.radius * 2, bank.radius * 2);
            }
        };

        const drawRain = (dt) => {
            ctx.strokeStyle = signal;
            ctx.lineWidth = 1.2;
            ctx.lineCap = "round";

            drops.forEach((drop, i) => {
                drop.x += drop.vx * dt;
                drop.y += drop.vy * dt;
                if (drop.y > height + EDGE) {
                    drops[i] = spawnDrop(false);
                    return;
                }

                ctx.globalAlpha = drop.alpha;
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x + rain.slant * drop.length, drop.y + drop.length);
                ctx.stroke();
            });
        };

        const drawDrift = (dt, seconds) => {
            drifters.forEach((p, i) => {
                p.x += (p.vx + Math.sin(seconds * p.swaySpeed + p.phase) * p.sway) * dt;
                p.y += p.vy * dt;
                p.rotation += p.spin * dt;
                if (isOutside(p)) {
                    drifters[i] = spawnDrifter(false);
                    return;
                }

                if (!p.sprite.complete || !p.sprite.naturalWidth) return;

                const glow = drift.twinkle ? 0.35 + 0.65 * Math.abs(Math.sin(seconds * 0.9 + p.phase)) : 1;
                // leaves and petals turn over as they fall
                const flip = drift.tumble ? Math.cos(seconds * p.swaySpeed * 1.6 + p.phase) : 1;

                ctx.save();
                ctx.globalAlpha = p.alpha * glow;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.scale(flip, 1);
                ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });
        };

        const tick = (now) => {
            if (!running) return;

            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);
            if (fog) drawFog(dt);
            if (rain) drawRain(dt);
            if (drift) drawDrift(dt, now / 1000);
            ctx.globalAlpha = 1;

            frame = requestAnimationFrame(tick);
        };

        const start = () => {
            if (running || reducedMotion.matches || document.hidden) return;
            running = true;
            last = performance.now();
            frame = requestAnimationFrame(tick);
        };

        const stop = () => {
            running = false;
            cancelAnimationFrame(frame);
        };

        const onVisibility = () => (document.hidden ? stop() : start());

        const onMotionChange = () => {
            if (reducedMotion.matches) {
                stop();
                ctx.clearRect(0, 0, width, height);
            } else {
                start();
            }
        };

        // the rain and mist take the accent colour, which changes with the theme
        const themeObserver = new MutationObserver(readColors);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-season"] });

        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", onVisibility);
        reducedMotion.addEventListener("change", onMotionChange);

        readColors();
        resize();
        start();

        return () => {
            stop();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            themeObserver.disconnect();
            window.removeEventListener("resize", resize);
            document.removeEventListener("visibilitychange", onVisibility);
            reducedMotion.removeEventListener("change", onMotionChange);
        };
    }, [season]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        />
    );
}
