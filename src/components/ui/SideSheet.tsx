"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function SideSheet({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close sidesheet"
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-[420px] flex-col border-l border-line bg-white">
        <header className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold text-foreground">{title}</h2>
            {description ? (
              <p className="mt-1 text-[13px] text-muted">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-[#f7f7f7]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </aside>
    </div>
  );
}
