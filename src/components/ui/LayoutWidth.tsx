import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function LayoutWidth({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const defaultClassName = "mx-auto h-full w-full max-w-7xl px-4 lg:px-6";
  return <div className={twMerge(defaultClassName, className)}>{children}</div>;
}
