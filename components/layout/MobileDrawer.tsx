"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { navLinks, couple } from "@/lib/data";

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col bg-[color:var(--background)] lg:hidden"
        >
          <div className="flex items-center justify-between px-6 py-6">
            <span className="font-serif text-2xl text-[color:var(--ink)]">
              {couple.hashtag}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-full p-2 text-[color:var(--ink)] transition-colors hover:text-[color:var(--gold)]"
            >
              <X size={28} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-serif text-3xl text-[color:var(--ink)] transition-colors hover:text-[color:var(--gold)]"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
