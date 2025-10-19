import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors " +
    "hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 " +
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      size: {
        sm: "h-6 px-2",
        md: "h-8 px-3",
        lg: "h-10 px-4",
      },
      variant: {
        default: "",
        subtle: "bg-muted text-muted-foreground hover:bg-muted/80",
        outline: "border border-border bg-background",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
));

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
