/** Minimal line-icon set (Feather-style, hand-picked paths) used in place of
 * emoji throughout the chrome — keeps the nav/stat-card UI looking like a
 * designed product rather than a placeholder prototype. */
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Icon({ children, size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      {children}
    </svg>
  );
}

export const LogoMark = (props) => (
  <Icon {...props}>
    <polyline points="9 8 4 13 9 18" />
    <polyline points="15 8 20 13 15 18" />
    <line x1="13" y1="5" x2="11" y2="21" />
  </Icon>
);

export const HomeIcon = (props) => (
  <Icon {...props}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </Icon>
);

export const BookIcon = (props) => (
  <Icon {...props}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
  </Icon>
);

export const GridIcon = (props) => (
  <Icon {...props}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
  </Icon>
);

export const TargetIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </Icon>
);

export const ChartIcon = (props) => (
  <Icon {...props}>
    <path d="M4 20V10" />
    <path d="M11 20V4" />
    <path d="M18 20v-7" />
    <path d="M3 20h18" />
  </Icon>
);

export const TrophyIcon = (props) => (
  <Icon {...props}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5H4a3 3 0 0 0 3 4" />
    <path d="M17 5h3a3 3 0 0 1-3 4" />
    <path d="M12 13v3" />
    <path d="M9 20h6" />
    <path d="M10 16.5h4v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Z" />
  </Icon>
);

export const AwardIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="8.5" r="5" />
    <path d="M9 13 7.5 20 12 17.5 16.5 20 15 13" />
  </Icon>
);

export const UserIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
  </Icon>
);

export const UsersIcon = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
    <path d="M15.5 5.5a3 3 0 0 1 0 5.8" />
    <path d="M17 13.8c2 .5 3.5 2.5 3.5 5.2" />
  </Icon>
);

export const SettingsIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
  </Icon>
);

export const FileIcon = (props) => (
  <Icon {...props}>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4" />
    <path d="M9.5 13h5M9.5 16.5h5" />
  </Icon>
);

export const StarIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3.5 14.6 9l6 .8-4.4 4.1 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.8l6-.8Z" />
  </Icon>
);

export const FlameIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3c2 2.5-1 4-1 6.5A3 3 0 0 0 14 12c1.4-.9 1-2.5 1-2.5 2 1.5 3 3.8 3 6a6 6 0 0 1-12 0c0-3 1.5-5 2.5-7 .3 1.3 1 2 1.5 2C8.5 8 9 5 12 3Z" />
  </Icon>
);

export const InboxIcon = (props) => (
  <Icon {...props}>
    <path d="M4 12h4l1.5 3h5L16 12h4" />
    <path d="M5.5 6h13L21 12v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6L5.5 6Z" />
  </Icon>
);

export const TrendDownIcon = (props) => (
  <Icon {...props}>
    <polyline points="3 7 10 14 14 10 21 17" />
    <polyline points="21 10 21 17 14 17" />
  </Icon>
);

export const AlertIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <circle cx="12" cy="16.2" r="0.6" fill="currentColor" />
  </Icon>
);

export const MenuIcon = (props) => (
  <Icon {...props}>
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </Icon>
);
