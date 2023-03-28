import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input(props: InputProps) {
  const { error } = props;
  const defaultStyle = `rounded-md bg-neutral-200 p-4 transition outline-none ${
    error ? "bg-red-200" : ""
  }`;
  const className = twMerge(defaultStyle, props?.className);
  return <input {...props} className={className} />;
}
