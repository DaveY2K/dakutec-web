import Button from "@/components/ui/Button";

export default function SkipLink() {
  return (
    <Button
      href="#main"
      variant="primary"
      size="sm"
      className="sr-only focus:not-sr-only fixed top-3 left-3 z-[100]"
      ariaLabel="Skip to main content"
    >
      Skip to main content
    </Button>
  );
}
