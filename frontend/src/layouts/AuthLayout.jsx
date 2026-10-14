import { Outlet } from "react-router-dom";

import { LogoMark } from "../components/icons";
import TiltCard from "../components/TiltCard";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-ink-900 px-4">
      {/* Floating 3D gradient orbs — pure CSS depth, no extra dependency */}
      <div className="orb -left-24 top-10 h-80 w-80 animate-orb-float-1 bg-violet-400/30" />
      <div className="orb -right-16 top-1/3 h-96 w-96 animate-orb-float-2 bg-cyan-300/20" />
      <div className="orb bottom-0 left-1/3 h-72 w-72 animate-orb-float-3 bg-brand-300/25" />

      {/* Subtle dot-grid texture for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-white">
          <span className="group flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur transition-transform hover:animate-logo-spin">
            <LogoMark size={26} />
          </span>
          <h1 className="text-2xl font-bold">CodeLens</h1>
          <p className="text-sm text-brand-100">Interactive Algorithm & Data Structure Learning</p>
        </div>
        <TiltCard max={4} glare className="card animate-slide-up p-7">
          <Outlet />
        </TiltCard>
      </div>
    </div>
  );
}
