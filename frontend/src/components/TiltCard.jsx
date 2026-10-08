import { useRef, useState } from "react";

/** Pointer-reactive 3D tilt wrapper — perspective + rotateX/Y driven by cursor
 * position, plus a radial "glare" that follows the pointer. Pure CSS
 * transforms (no dependency), resets smoothly on pointer leave. */
export default function TiltCard({ children, className = "", max = 10, glare = true }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const [active, setActive] = useState(false);

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * max * 2;
    const rotateX = (0.5 - y) * max * 2;
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015,1.015,1.015)`,
      "--glare-x": `${x * 100}%`,
      "--glare-y": `${y * 100}%`,
    });
    setActive(true);
  }

  function handleLeave() {
    setStyle({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)" });
    setActive(false);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-card relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={style}
    >
      {children}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200"
          style={{
            opacity: active ? 1 : 0,
            background:
              "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.35), transparent 55%)",
          }}
        />
      )}
    </div>
  );
}
