import Link from "next/link";
import React from "react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type DefaultStyles = "outline" | "primary" | "secondary";

export default function Button({
  href,
  className,
  children,
  style = "primary",
  onClick,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
  style?: DefaultStyles;
  onClick?: () => void;
}) {
  let defaultStyle = "";
  switch (style) {
    case "primary": {
      defaultStyle = "";
      break;
    }
    case "secondary": {
      defaultStyle = "";
      break;
    }
    case "outline": {
      defaultStyle = "border rounded-full p-4 border-white";
      break;
    }
    default: {
      defaultStyle = "";
      break;
    }
  }
  const buttonClasses = twMerge(defaultStyle, className);
  return (
    <>
      {href ? (
        <Link className={buttonClasses} href={href}>
          {children}
        </Link>
      ) : (
        <button onClick={onClick} className={buttonClasses}>
          {children}
        </button>
      )}
    </>
  );
}
