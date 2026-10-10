"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import Initials from "@/components/ui/Initials";

type SessionUser = {
  name: string;
  email: string;
  role: string;
};

export default function Header({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (response.ok) setUser(data);
      } catch {
        setUser(null);
      }
    }

    void loadUser();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center gap-4 bg-white px-4 sm:px-7">
      <button
        type="button"
        onClick={onMenu}
        className="rounded-xl p-2 text-muted hover:bg-white md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <label className="relative flex min-w-0 flex-1 items-center">
        <Search className="pointer-events-none absolute left-4 h-4 w-4 text-neutral-400" />
        <input
          type="search"
          placeholder="What do you want to find?"
          className="h-11 w-full max-w-[520px] rounded-full border border-line bg-[#f7f7f7] px-11 text-[14px] text-foreground outline-none placeholder:text-neutral-400 focus:border-[#1B7A32]/40 focus:bg-white"
        />
      </label>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative rounded-full border border-line bg-white p-2.5 text-muted"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-full border border-line bg-white p-2.5 text-muted"
          aria-label="Sign out"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
        <div className="ml-1 flex items-center gap-3">
          <Initials name={user?.name || "Staff"} className="h-9 w-9 text-[12px]" />
          <div className="hidden leading-tight sm:block">
            <p className="text-[14px] font-semibold text-foreground">
              {user?.name || "Staff"}
            </p>
            <p className="text-[12px] text-muted capitalize">
              {user?.role || "admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
