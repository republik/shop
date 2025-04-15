"use client";

import { css, cx } from "@/theme/css";
import { Check, ChevronRight, Circle } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import * as React from "react";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cx(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className={css({ marginLeft: "auto", h: "4", w: "4" })} />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cx(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cx(
        // "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover",
        // "p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        css({
          zIndex: "50",
          minWidth: "[8rem]",
          overflow: "hidden",
          borderRadius: "md",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "divider",
          bg: "background",
          // bg: 'popover'
          // color: 'popover-foreground'
          p: "1",
          shadow: "md",
          '&[data-state="open"]': {},
          '&[data-state="closed]': {},
          '&[data-side="left"]': {},
          '&[data-side="top"]': {},
          '&[data-side="right"]': {},
          '&[data-side="bottom"]': {},
        }),
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cx(
      css({
        position: "relative",
        cursor: "default",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        borderRadius: "sm",
        px: "2",
        py: "1.5",
        fontSize: "sm",
        outline: "none",
        transition: "colors",
        w: "full",
        _hover: {
          cursor: "pointer",
        },
        _focus: {
          bg: "gray.100",
          // bg: 'accent',
          // fontSize: 'accent'
        },
        _disabled: {
          pointerEvents: "none",
          opacity: "50%",
        },
      }),
      inset && css({ paddingLeft: "8" }),
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cx(
      css({
        position: "relative",
        cursor: "default",
        userSelect: "none",
        borderRadius: "sm",
        py: "1.5",
        pl: "8",
        pr: "2",
        fontSize: "sm",
        outline: "none",
        transition: "colors",
        _focus: {
          // bg: 'acccent',
          // color: 'accent-foreground'
        },
        _disabled: {
          pointerEvents: "none",
          opacity: "0.5",
        },
      }),
      className
    )}
    checked={checked}
    {...props}
  >
    <span
      className={cx(
        css({
          position: "absolute",
          left: "2",
          display: "flex",
          h: "3.5",
          w: "3.5",
          alignItems: "center",
          justifyContent: "center",
        })
      )}
    >
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cx(
      css({
        position: "relative",
        display: "flex",
        cursor: "default",
        alignItems: "center",
        borderRadius: "sm",
        py: "1.5",
        pl: "8",
        pr: "2",
        fontSize: "sm",
        outline: "none",
        transition: "colors",
        _focus: {
          // bg: 'accent'
          // color: 'accent-foreground
        },
        _disabled: {
          pointerEvents: "none",
          opacity: "0.5",
        },
      }),
      className
    )}
    {...props}
  >
    <span
      className={css({
        position: "absolute",
        left: "2",
        h: "3.5",
        w: "3.5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle
          className={css({
            h: "2",
            w: "2",
            fill: "current",
          })}
        />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cx(
      css({
        px: "2",
        py: "1.5",
        fontSize: "sm",
        fontWeight: "semibold",
      }),
      inset && css({ paddingLeft: "8" }),
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cx(
      css({ mx: "-1", my: "1", h: "[1px]", bg: "divider" }),
      className
    )}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cx(
        css({
          ml: "auto",
          fontSize: "xs",
          letterSpacing: "widest",
          opacity: "0.6",
        }),
        className
      )}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
