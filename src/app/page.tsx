"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { LucideProps } from "lucide-react";
import {
  ArrowLeft,
  ChevronRight,
  Pin,
  PinOff,
  Moon,
  Sun,
  ArrowUp,
  Copy,
  Check,
  Settings,
  Search,
  MessageSquarePlus,
} from "lucide-react";
import {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Icons
export const icons = {
  back: ArrowLeft,
  collapse: ChevronRight,
  pin: Pin,
  unpin: PinOff,
  moon: Moon,
  sun: Sun,
  send: ArrowUp,
  copy: Copy,
  check: Check,
  settings: Settings,
  search: Search,
  newThread: MessageSquarePlus,
} as const;

export type IconType = keyof typeof icons;

// Icon Component
export interface IconProps extends LucideProps {
  name: IconType;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const Comp = icons[name];
  return <Comp {...props} />;
};

// BgGradient Component
export function BgGradient({ className }: React.ComponentProps<"div">) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <div className={cn("fixed inset-0 -z-50 dark:bg-sidebar", className)}>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(closest-corner at 180px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))"
            : "radial-gradient(closest-corner at 120px 36px, rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0)), linear-gradient(rgb(254, 247, 255) 15%, rgb(244, 214, 250))",
        }}
      />
      <div className="absolute inset-0 bg-noise" />
      {isDark && <div className="absolute inset-0 bg-black/40" />}
    </div>
  );
}

function LogoWithNewChat() {
  const router = useRouter();
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key === "o"
      ) {
        event.preventDefault();
        router.push("/");
      }
    };

    document.addEventListener("keydown", handleKeyPress, { signal });

    return () => {
      controller.abort();
    };
  }, [router]);

  return <div className="h-8 shrink-0" />;
}

// Setting Navigation Components
function ToggleTheme() {
  const { setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      tabIndex={-1}
      className="size-8 p-0 rounded-md"
      onMouseDownCapture={() =>
        setTheme((theme) => (theme === "dark" ? "light" : "dark"))
      }
    >
      <Icon
        name="moon"
        className="absolute size-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0"
      />
      <Icon
        name="sun"
        className="absolute size-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function SettingNavSvg({ className, ...props }: React.ComponentProps<"div">) {
  const { open } = useSidebar();
  return (
    <div
      className={cn("fixed right-0 top-0 max-sm:hidden", className)}
      {...props}
    >
      <div
        className={cn(
          "group pointer-events-none absolute top-3.5 z-10 -mb-8 h-32 w-full origin-top transition-all ease-snappy",
          !open && "-translate-y-3.5 scale-y-0"
        )}
        style={{ boxShadow: "10px -10px 8px 2px var(--gradient-noise-top)" }}
      >
        <svg
          className="absolute -right-8 h-9 origin-top-left skew-x-[30deg] overflow-visible"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 32"
        >
          <line
            stroke="var(--gradient-noise-top)"
            strokeWidth="2px"
            shapeRendering="optimizeQuality"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeMiterlimit="10"
            x1="1"
            y1="0"
            x2="128"
            y2="0"
          ></line>
          <path
            className="translate-y-[0.5px]"
            fill="var(--gradient-noise-top)"
            shapeRendering="optimizeQuality"
            strokeWidth="1px"
            strokeLinecap="round"
            strokeMiterlimit="10"
            vectorEffect="non-scaling-stroke"
            d="M0,0c5.9,0,10.7,4.8,10.7,10.7v10.7c0,5.9,4.8,10.7,10.7,10.7H128V0"
            stroke="var(--chat-border)"
          ></path>
        </svg>
      </div>
    </div>
  );
}

function SettingNav() {
  const { open } = useSidebar();
  return (
    <div
      className="fixed right-2 top-2 z-20 max-sm:hidden"
      style={{ right: "var(--firefox-scrollbar, 0.5rem)" }}
    >
      <div
        className={cn(
          "flex flex-row items-center text-muted-foreground gap-0.5 rounded-md p-1 transition-all bg-sidebar/50 backdrop-blur-sm blur-fallback:bg-sidebar",
          open && "rounded-bl-xl bg-gradient-noise-top"
        )}
      >
        <Button
          variant="ghost"
          tabIndex={-1}
          aria-label="Go to settings"
          className={cn("size-8 p-0 rounded-md", open && "rounded-bl-xl")}
          onClick={(e) => {
            e.preventDefault();
            // Settings button does nothing
          }}
        >
          <Icon name="settings" className="size-4" />
          <span className="sr-only">Settings</span>
        </Button>
        <ToggleTheme />
      </div>
    </div>
  );
}

// useSidebarResize Hook
export interface UseSidebarResizeProps {
  currentWidth: string;
  isCollapsed?: boolean;
  onResize: (width: string) => void;
  minResizeWidth?: string;
  maxResizeWidth?: string;
  setIsDraggingRail?: (isDragging: boolean) => void;
  widthCookieName?: string;
  widthCookieMaxAge?: number;
}

interface WidthUnit {
  value: number;
  unit: "px";
}

function parseWidth(width: string): WidthUnit {
  const unit = "px";
  const value = Number.parseFloat(width);
  return { value, unit };
}

function formatWidth(value: number, unit: "px"): string {
  return `${Math.round(value)}${unit}`;
}

export function useSidebarResize({
  currentWidth,
  onResize,
  isCollapsed = false,
  minResizeWidth = "256px",
  maxResizeWidth = "864px",
  setIsDraggingRail = () => {},
  widthCookieName,
  widthCookieMaxAge = 60 * 60 * 24 * 7, // 1 week default
}: UseSidebarResizeProps) {
  const startWidth = React.useRef(0);
  const startX = React.useRef(0);
  const isDragging = React.useRef(false);
  const isInteractingWithRail = React.useRef(false);
  const lastWidth = React.useRef(0);
  const lastLoggedWidth = React.useRef(0);
  const dragStartPoint = React.useRef(0);
  const lastDragDirection = React.useRef<"expand" | "collapse" | null>(null);
  const lastTogglePoint = React.useRef(0);
  const lastToggleWidth = React.useRef(0);
  const toggleCooldown = React.useRef(false);
  const lastToggleTime = React.useRef(0);
  const dragDistanceFromToggle = React.useRef(0);
  const dragOffset = React.useRef(0);
  const railRect = React.useRef<DOMRect | null>(null);

  const minWidthPx = React.useMemo(
    () => parseWidth(minResizeWidth).value,
    [minResizeWidth]
  );
  const maxWidthPx = React.useMemo(
    () => parseWidth(maxResizeWidth).value,
    [maxResizeWidth]
  );

  const isIncreasingWidth = React.useCallback(
    (currentX: number, referenceX: number): boolean => currentX > referenceX,
    []
  );

  const calculateWidth = React.useCallback(
    (e: MouseEvent): number => e.clientX,
    []
  );

  const persistWidth = React.useCallback(
    (width: string) => {
      if (widthCookieName) {
        document.cookie = `${widthCookieName}=${width}; path=/; max-age=${widthCookieMaxAge}`;
      }
    },
    [widthCookieName, widthCookieMaxAge]
  );

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      isInteractingWithRail.current = true;

      const currentWidthPx = isCollapsed ? 0 : parseWidth(currentWidth).value;
      startWidth.current = currentWidthPx;
      startX.current = e.clientX;
      dragStartPoint.current = e.clientX;
      lastWidth.current = currentWidthPx;
      lastLoggedWidth.current = currentWidthPx;
      lastTogglePoint.current = e.clientX;
      lastToggleWidth.current = currentWidthPx;
      lastDragDirection.current = null;
      toggleCooldown.current = false;
      lastToggleTime.current = 0;
      dragDistanceFromToggle.current = 0;
      dragOffset.current = 0;
      railRect.current = null;

      e.preventDefault();
    },
    [isCollapsed, currentWidth]
  );

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInteractingWithRail.current) return;

      const deltaX = Math.abs(e.clientX - startX.current);
      if (!isDragging.current && deltaX > 5) {
        isDragging.current = true;
        setIsDraggingRail(true);
      }

      if (isDragging.current) {
        const { unit } = parseWidth(currentWidth);

        const currentDragDirection = isIncreasingWidth(
          e.clientX,
          lastTogglePoint.current
        )
          ? "expand"
          : "collapse";

        // Update direction tracking
        if (lastDragDirection.current !== currentDragDirection) {
          lastDragDirection.current = currentDragDirection;
        }

        // Calculate distance from last toggle point
        dragDistanceFromToggle.current = Math.abs(
          e.clientX - lastTogglePoint.current
        );

        // Check for toggle cooldown (prevent rapid toggling)
        const now = Date.now();
        if (toggleCooldown.current && now - lastToggleTime.current > 200) {
          toggleCooldown.current = false;
        }

        if (isCollapsed) return;

        const newWidthPx = calculateWidth(e);

        // Clamp width between min and max
        const clampedWidthPx = Math.max(
          minWidthPx,
          Math.min(maxWidthPx, newWidthPx)
        );

        const formattedWidth = formatWidth(clampedWidthPx, unit);
        onResize(formattedWidth);
        persistWidth(formattedWidth);

        // Update last width
        lastWidth.current = clampedWidthPx;
      }
    };

    const handleMouseUp = () => {
      if (!isInteractingWithRail.current) return;

      isDragging.current = false;
      isInteractingWithRail.current = false;
      lastWidth.current = 0;
      lastLoggedWidth.current = 0;
      lastDragDirection.current = null;
      lastTogglePoint.current = 0;
      lastToggleWidth.current = 0;
      toggleCooldown.current = false;
      lastToggleTime.current = 0;
      dragDistanceFromToggle.current = 0;
      dragOffset.current = 0;
      railRect.current = null;
      setIsDraggingRail(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    onResize,
    isCollapsed,
    currentWidth,
    persistWidth,
    setIsDraggingRail,
    minWidthPx,
    maxWidthPx,
    isIncreasingWidth,
    calculateWidth,
  ]);

  return {
    handleMouseDown,
  };
}

const ThreadWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculateHeight = containerRef.current?.clientHeight || 500;
  return (
    <div
      style={{
        overflowAnchor: "none",
        flex: "0 0 auto",
        position: "relative",
        visibility: "hidden",
        width: "100%",
        height: `${calculateHeight}px`,
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "100%",
          visibility: "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
};

function ChatSidebar() {
  return (
    <Sidebar className="z-50 border-none p-2">
      <SidebarHeader className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0">
        <LogoWithNewChat />
      </SidebarHeader>
      <SidebarContent className="small-scrollbar scroll-shadow relative pb-2">
        <ThreadWrapper>{/* Empty sidebar - no threads */}</ThreadWrapper>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function ChatBackground() {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "absolute bottom-0 top-0 w-full overflow-hidden border-l border-t border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none sm:translate-y-3.5 sm:rounded-tl-xl",
        !open && "!translate-y-0 !rounded-none border-none"
      )}
    >
      <div
        className={cn(
          "bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]",
          !open && "translate-y-3.5"
        )}
      />
    </div>
  );
}

function SidebarNav() {
  const { open } = useSidebar();
  return (
    <div className="pointer-events-auto fixed left-2 z-50 flex flex-row gap-0.5 p-1 top-2">
      <div
        className={cn(
          "duration-250 pointer-events-none absolute inset-0 right-auto -z-10 w-10 rounded-md bg-transparent backdrop-blur-sm transition-[background-color,width] delay-0 max-sm:delay-125 max-sm:duration-125 max-sm:w-[6.75rem] max-sm:bg-sidebar/50",
          !open &&
            "delay-125 duration-125 w-[6.75rem] bg-sidebar/50 blur-fallback:bg-sidebar"
        )}
      />
      <SidebarTrigger className="rounded-md text-muted-foreground" />
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-8 rounded-md text-muted-foreground duration-150 translate-x-0 opacity-100 delay-150",
          open &&
            "sm:pointer-events-none sm:-translate-x-[2.125rem] sm:opacity-0 sm:delay-0 sm:duration-150"
        )}
      >
        <Icon name="search" />
        <span className="sr-only">Search</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className={cn(
          "size-8 rounded-md text-muted-foreground duration-150 translate-x-0 opacity-100 delay-150",
          open &&
            "sm:pointer-events-none sm:-translate-x-[2.125rem] sm:opacity-0 sm:delay-0 sm:duration-150"
        )}
      >
        <Link href="/">
          <Icon name="newThread" />
          <span className="sr-only">New Thread</span>
        </Link>
      </Button>
    </div>
  );
}

function TopbarDecoration() {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "absolute inset-x-3 top-0 z-10 box-content overflow-hidden border-b border-chat-border bg-gradient-noise-top/80 backdrop-blur-md transition-[transform,border] ease-snappy blur-fallback:bg-gradient-noise-top max-sm:hidden sm:h-3.5",
        !open && "-translate-y-[15px] border-transparent"
      )}
    >
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent blur-fallback:hidden" />
      <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent blur-fallback:hidden" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden" />
    </div>
  );
}

function Home() {
  return (
    <div
      className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pb-[144px]"
      style={{ scrollbarGutter: "stable both-edges" }}
    >
      <SettingNavSvg className="z-20 h-16 w-20" />
      <SettingNav />
      <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 py-10">
        <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
          <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
            <h2 className="text-3xl font-semibold">Welcome</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={true}>
        <BgGradient />
        <ChatSidebar />
        <SidebarNav />
        <main className="flex min-h-svh flex-col overflow-hidden w-full relative transistion-[width,height]">
          <ChatBackground />
          <TopbarDecoration />
          <div className="absolute bottom-0 top-0 w-full">
            <SettingNavSvg />
            <Home />
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
