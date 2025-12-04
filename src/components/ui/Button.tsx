import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const cx = (...p: Array<string | undefined | null | false>) =>
  p.filter(Boolean).join(" ");

const base =
  "inline-flex items-center justify-center rounded-xl font-medium transition outline-none";
const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};
const variants: Record<Variant, string> = {
  primary:
    "bg-[rgb(var(--brand))] text-white hover:brightness-110 focus-visible:ring-2 ring-[rgb(var(--brand))]/45",
  secondary:
    "border border-[rgb(var(--brand))]/40 text-[rgb(var(--brand))] hover:bg-[rgb(var(--brand))]/10 focus-visible:ring-2 ring-[rgb(var(--brand))]/35",
  ghost:
    "text-zinc-200 hover:bg-white/5 focus-visible:ring-2 ring-white/20",
};

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

// Link varianta (discriminant = href)
type LinkProps = Common & {
  href: string;
};

// Button varianta – NEMÁ href
type BtnProps = Common & {
  href?: never; // <-- klíčové pro správný narrowing
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export type ButtonProps = LinkProps | BtnProps;

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, ariaLabel } = props;
  const cls = cx(base, sizes[size], variants[variant], className);

  if ("href" in props) {
    const isExternal = /^https?:\/\//i.test(props.href as string);
    if (isExternal) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"   // ✅ správně
          aria-label={ariaLabel}
          className={cls}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href as string} aria-label={ariaLabel} className={cls}>
        {children}
      </Link>
    );
  }

  // tady je props typu BtnProps
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      aria-label={ariaLabel}
      className={cls}
    >
      {children}
    </button>
  );
}
