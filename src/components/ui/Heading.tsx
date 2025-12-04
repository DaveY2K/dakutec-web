// src/components/ui/Heading.tsx
import * as React from "react";
import { cn } from "./cn";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Align = "left" | "center" | "right";
type AsTag = "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";

const sizes: Record<Size, string> = {
  xs: "text-base sm:text-lg",
  sm: "text-xl sm:text-2xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
  xl: "text-4xl sm:text-5xl",
};

export type HeadingProps = {
  as?: AsTag;
  size?: Size;
  align?: Align;
  subtle?: boolean; // světlejší barva textu
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export default function Heading({
  as = "h2",
  size = "md",
  align = "left",
  subtle = false,
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-semibold tracking-tight",
        sizes[size],
        align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left",
        subtle ? "text-muted-foreground" : "text-foreground",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
