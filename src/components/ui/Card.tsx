import { twMerge } from "tailwind-merge";
import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** 
   * 'panel'  -> skleněná karta s jemnou mřížkou (stejná jako hero)
   * 'card'   -> základní „staré“ chování, pokud ho někde ještě chceš
   * 'plain'  -> bez předdef. stylů (jen className)
   */
  variant?: "panel" | "card" | "plain";
};

export default function Card({
  children,
  className,
  variant = "panel",
  ...rest
}: Props) {
  const base =
    variant === "panel"
      ? "panel pattern-card"
      : variant === "card"
      ? "card"
      : "";

  return (
    <div className={twMerge(base, className)} {...rest}>
      {children}
    </div>
  );
}
