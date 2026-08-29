"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <motion.a
        href="https://wa.me/2348171982126"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)]"
      >
        <MessageCircle size={22} />
      </motion.a>
    </div>
  );
}
