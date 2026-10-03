"use client";

import { motion } from "framer-motion";
import { Stethoscope, Sparkles } from "lucide-react";

export function AiLoadingIndicator({ label = "AI Doctor is thinking..." }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-primary/10 border border-blue-500/20 backdrop-blur-md shadow-lg max-w-xl mx-auto my-3"
    >
      <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 text-white shadow-md shadow-teal-500/30">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Stethoscope className="h-5 w-5" />
        </motion.div>
        <motion.div
          className="absolute -top-1 -right-1 text-yellow-300"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            {label}
          </span>
          <div className="flex items-center gap-1">
            <motion.span
              className="h-2 w-2 rounded-full bg-teal-500"
              animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            />
            <motion.span
              className="h-2 w-2 rounded-full bg-blue-500"
              animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            />
            <motion.span
              className="h-2 w-2 rounded-full bg-indigo-500"
              animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Analyzing symptoms and preparing medical guidance...
        </p>
      </div>
    </motion.div>
  );
}
