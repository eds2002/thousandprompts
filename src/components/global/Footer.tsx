import React from "react";
import LayoutWidth from "../ui/LayoutWidth";

export default function Footer() {
  return (
    <footer className="relative flex items-center justify-center bg-neutral-200 py-24">
      <LayoutWidth className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold">Logo</h1>
        <p className="text-lg font-semibold">A cool catchy slogan</p>
        <p className="absolute bottom-4 text-sm opacity-60">
          &copy; If this were a real app, this would be a little more detailed.
        </p>
      </LayoutWidth>
    </footer>
  );
}
