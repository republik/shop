"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { css, cx } from "@/theme/css";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cx(
      css({
        padding: "1",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "lg",
        height: "11",
      }),
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cx(
      css({
        display: "inline-flex",
        paddingTop: "1.5",
        paddingBottom: "1.5",
        paddingLeft: "3",
        paddingRight: "3",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "sm",
        fontSize: "md",
        lineHeight: "normal",
        fontWeight: "medium",
        whiteSpace: "nowrap",
        transition: "all",
        transitionTimingFunction: "[cubic-bezier(0.4, 0, 0.2, 1)]",
        transitionDuration: "fast",
        '&[data-state="active"]': {
          bg: "background",
        },
        _focusVisible: {
          outline: "[2px solid]",
          outlineColor: "zinc.700",
          outlineOffset: "1",
        },
        _disabled: {
          pointerEvents: "none",
          opacity: "0.5",
        },
      }),
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cx(
      css({
        mt: "2",
        _focus: {
          outline: "none",
        },
      }),
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
