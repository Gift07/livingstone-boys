"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import SchoolLogo from "@/components/brand/SchoolLogo";
import { NavIcon } from "@/components/icons";
import { navItems, type NavItem } from "@/lib/nav";
import { school } from "@/lib/school";

function pathOf(href?: string) {
  return href?.split("?")[0] || "";
}

function isActive(pathname: string, href?: string) {
  const path = pathOf(href);
  if (!path || !pathname) return false;
  if (path === "/dashboard") return pathname === "/dashboard";
  return pathname === path || pathname.startsWith(`${path}/`);
}

const subscribe = () => () => {};

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const currentPath = mounted ? pathname : "";
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function groupOpen(item: NavItem) {
    if (expanded[item.label] !== undefined) return expanded[item.label];
    if (item.label === "Home") return true;
    return (
      isActive(currentPath, item.href) ||
      Boolean(item.children?.some((child) => isActive(currentPath, child.href)))
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-900/30 md:hidden ${open ? "block" : "hidden"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[232px] flex-col border-r border-line bg-white transition-transform md:sticky md:top-0 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center gap-2.5 px-4">
          <SchoolLogo size={40} />
          <div className="min-w-0 leading-tight" suppressHydrationWarning>
            <p
              className="truncate text-[14px] font-semibold text-foreground"
              suppressHydrationWarning
            >
              {school.shortName}
            </p>
            <p className="truncate text-[11px] text-muted" suppressHydrationWarning>
              Boys&apos; Seminary
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-8">
          {navItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const openGroup = groupOpen(item);
            const selfActive = !hasChildren && isActive(currentPath, item.href);

            return (
              <div key={item.label} className="mb-0.5">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((current) => ({
                        ...current,
                        [item.label]: !openGroup,
                      }))
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-muted hover:bg-background hover:text-foreground"
                  >
                    <NavIcon name={item.icon} className="h-[18px] w-[18px]" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition ${openGroup ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href || "/"}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] ${
                      selfActive
                        ? "bg-purple-soft font-medium text-purple"
                        : "text-muted hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <NavIcon name={item.icon} className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                )}

                {hasChildren && openGroup ? (
                  <div className="mb-1 ml-2 mt-0.5 space-y-0.5 border-l border-line pl-3">
                    {item.children?.map((child) => {
                      const path = pathOf(child.href);
                      const highlighted =
                        item.label === "Home"
                          ? currentPath === path
                          : currentPath === path && !child.href.includes("new=1");

                      return (
                        <Link
                          key={`${item.label}-${child.label}`}
                          href={child.href}
                          onClick={onClose}
                          className={`relative flex items-center rounded-xl px-3 py-2 text-[14px] ${
                            highlighted
                              ? "bg-purple-soft font-medium text-purple"
                              : "text-muted hover:text-foreground"
                          }`}
                        >
                          {highlighted && item.label === "Home" ? (
                            <span className="absolute -left-[13px] top-1.5 h-5 w-[3px] rounded-full bg-purple" />
                          ) : null}
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
        <div className="border-t border-line px-4 py-4">
          <Link
            href="/"
            onClick={onClose}
            className="block text-[12px] text-muted hover:text-foreground"
          >
            Public alumni site
          </Link>
        </div>
      </aside>
    </>
  );
}
