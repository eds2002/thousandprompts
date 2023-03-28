import { motion } from "framer-motion";
import React, { useRef } from "react";
import { useClickOutside } from "~/hooks/useClickOutside";

export default function ErrorModal({
  children,
  setStateFn,
}: {
  children: React.ReactNode;
  setStateFn: (val?: any) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setStateFn());
  return (
    <motion.div
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      exit={{ backgroundColor: "rgba(0,0,0,0)" }}
      className="fixed inset-0 z-[50] flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 25, opacity: 0 }}
        ref={ref}
        className="mx-auto w-screen max-w-md rounded-xl bg-white p-4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
