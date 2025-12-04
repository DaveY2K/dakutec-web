// src/components/ui/Input.tsx
import * as React from "react";
import { cn } from "./cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-gray-300 bg-white/80 px-3 py-2",
        "placeholder:text-gray-400 outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        "dark:border-gray-700 dark:bg-white/5",
        className
      )}
      {...props}
    />
  );
});

export default Input;
