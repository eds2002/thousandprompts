import Link from "next/link";
import React, { ClassAttributes, ComponentClass } from "react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { VscLoading } from "react-icons/vsc";

type DefaultStyles = "outline" | "primary" | "secondary";

export default function Button({
  href,
  className,
  children,
  style = "primary",
  onClick,
  disabled = false,
  isLoading = false,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
  style?: DefaultStyles;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  let defaultStyle = "";
  switch (style) {
    case "primary": {
      defaultStyle = "disabled:bg-stone-600 disabled:cursor-default";
      break;
    }
    case "secondary": {
      defaultStyle = "disabled:bg-stone-600 disabled:cursor-default";
      break;
    }
    case "outline": {
      defaultStyle =
        "border rounded-full p-4 border-white disabled:bg-stone-600 disabled:cursor-default";
      break;
    }
    default: {
      defaultStyle = "disabled:bg-stone-600 disabled:cursor-default";
      break;
    }
  }
  const buttonClasses = twMerge(defaultStyle, className);
  return (
    <>
      {href ? (
        <Link className={"relative block  " + buttonClasses} href={href}>
          {children}
        </Link>
      ) : (
        <button disabled={disabled} onClick={onClick} className={buttonClasses}>
          {isLoading ? (
            <VscLoading className="animate-spin" />
          ) : (
            <>{children}</>
          )}
        </button>
      )}
    </>
  );
}
