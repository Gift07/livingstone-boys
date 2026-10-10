"use client";

import { Suspense, useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-full bg-white text-foreground">
      <div className="flex min-h-screen">
        <div className="no-print md:sticky md:top-0 md:h-screen md:self-start">
          <Suspense
            fallback={
              <aside className="h-screen w-[232px] border-r border-line bg-white" />
            }
          >
            <Sidebar open={open} onClose={() => setOpen(false)} />
          </Suspense>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="no-print">
            <Header onMenu={() => setOpen(true)} />
          </div>
          <main className="flex-1 px-4 pb-10 pt-6 sm:px-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
