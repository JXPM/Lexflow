import { useWindowDimensions } from "react-native";

/** Breakpoints (px) — mobile-first. */
export const BP = { tablet: 768, desktop: 1024 } as const;

/** Sidebar widths per layout. 0 on mobile (bottom bar instead). */
export const SIDEBAR = { desktop: 248, tablet: 88, mobile: 0 } as const;

export interface Responsive {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  /** Whether the left sidebar nav is shown (tablet + desktop). */
  hasSidebar: boolean;
  /** Current sidebar width (0 on mobile). */
  sidebarWidth: number;
}

/** Single source of truth for layout breakpoints across the app. */
export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= BP.desktop;
  const isTablet = width >= BP.tablet && width < BP.desktop;
  const isMobile = width < BP.tablet;
  const sidebarWidth = isDesktop ? SIDEBAR.desktop : isTablet ? SIDEBAR.tablet : SIDEBAR.mobile;
  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    hasSidebar: isDesktop || isTablet,
    sidebarWidth,
  };
}
