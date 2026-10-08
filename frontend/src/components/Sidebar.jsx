import { NavLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import {
  AwardIcon, BookIcon, ChartIcon, GridIcon, HomeIcon,
  SettingsIcon, TargetIcon, TrophyIcon, UserIcon,
} from "./icons";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", Icon: HomeIcon },
  { to: "/algorithms", label: "Algorithms", Icon: BookIcon },
  { to: "/data-structures", label: "Data Structures", Icon: GridIcon },
  { to: "/challenges", label: "Challenges", Icon: TargetIcon },
  { to: "/analytics", label: "Analytics", Icon: ChartIcon },
  { to: "/leaderboard", label: "Leaderboard", Icon: TrophyIcon },
  { to: "/achievements", label: "Achievements", Icon: AwardIcon },
  { to: "/profile", label: "Profile", Icon: UserIcon },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-ink-950/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 transform border-r border-ink-200 bg-white pt-16 transition-transform lg:static lg:translate-x-0 lg:pt-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex h-full flex-col gap-1 overflow-y-auto p-4">
          {LINKS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-100"
                }`
              }
            >
              <Icon className="shrink-0" />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Admin</div>
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-100"
                  }`
                }
              >
                <SettingsIcon className="shrink-0" />
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
