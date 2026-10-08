import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { LogoMark, MenuIcon } from "./icons";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-md p-2 text-ink-500 hover:bg-ink-100 lg:hidden" aria-label="Toggle menu">
          <MenuIcon />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-ink-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white transition-transform hover:animate-logo-spin">
            <LogoMark size={18} />
          </span>
          <span className="hidden sm:inline">CodeLens</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-ink-500 sm:inline">
          Hi, <span className="font-semibold text-ink-800">{user?.username}</span>
        </span>
        <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
          {user?.username?.[0]?.toUpperCase()}
        </Link>
        <button onClick={handleLogout} className="btn-ghost">
          Logout
        </button>
      </div>
    </header>
  );
}
