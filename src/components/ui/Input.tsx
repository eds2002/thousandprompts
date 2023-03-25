import React from "react";
import { twMerge } from "tailwind-merge";

export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const defaultStyle = "rounded-md bg-neutral-200 p-4 outline-none";
  const className = twMerge(defaultStyle, props?.className);
  return <input {...props} className={className} />;
}
