import React, { ReactNode } from "react";

export default function LayoutWidth({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto h-full w-full max-w-7xl px-4 lg:px-6 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}
