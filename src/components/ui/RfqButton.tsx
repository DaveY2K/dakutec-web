import Button from "./Button";

export default function RfqButton({
  href,
  label,
  variant = "primary",
  size = "md",
  className,
  type,
}: {
  href?: string;                 // když není, renderuje <button>
  label: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;            // pro full width, FAB, apod.
  type?: "button" | "submit" | "reset";
}) {
  if (href) {
    return (
      <Button href={href} variant={variant} size={size} className={className} ariaLabel={label}>
        {label}
      </Button>
    );
  }
  return (
    <Button variant={variant} size={size} className={className} ariaLabel={label} type={type}>
      {label}
    </Button>
  );
}
