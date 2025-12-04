// src/components/ui/Container.tsx
import { cn } from "./cn";

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Container({ className, ...props }: Props) {
  return (
    <div
     className={cn("container-app", className)}
      {...props}
    />
  );
}
