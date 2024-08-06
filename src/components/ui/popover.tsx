"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { css, cx } from "@/theme/css";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cx(
        css({
          zIndex: 50,
          width: "[18rem]",
          borderRadius: "[0.375rem]",
          border: "[1px solid]",
          backgroundColor: "background",
          padding: "4",
          color: "var(--text-popover-foreground)",
          boxShadow: "[0 4px 6px rgba(0, 0, 0, 0.1)]",
          outline: "none",
          '&[data-state="open"]': {
            animation: "[in 0.2s]",
            opacity: 1,
            transform: "scale(1)",
          },
          '&[data-state="closed"]': {
            animation: "[out 0.2s]",
            opacity: 0,
            transform: "scale(0.95)",
          },
          '&[data-side="bottom"]': {
            animation: "[slide-in-from-top 0.2s]",
          },
          '&[data-side="left"]': {
            animation: "[slide-in-from-right 0.2s]",
          },
          '&[data-side="right"]': {
            animation: "[slide-in-from-left 0.2s]",
          },
          '&[data-side="top"]': {
            animation: "[slide-in-from-bottom 0.2s]",
          },
        }),
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
