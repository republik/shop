"use client";

import { css, cx } from "@/theme/css";
import { Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cx(
      css({
        position: "relative",
        display: "flex",
        width: "full",
        alignItems: "center",
        height: "4",
        touchAction: "none",
        userSelect: "none",
      }),
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cx(
        css({
          position: "relative",
          width: "full",
          height: "2",
          flexGrow: "1",
          overflow: "hidden",
          bg: "background",
          borderRadius: "full",
          borderColor: "primary",
          borderWidth: "1",
          borderStyle: "solid",
        })
      )}
    >
      <SliderPrimitive.Range
        className={cx(
          css({
            position: "absolute",
            height: "full",
            bg: "primary",
          })
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cx(
        css({
          display: "block",
          borderRadius: "full",
          bg: "primary",
          height: "4",
          width: "4",
          "&:disabled": {
            bg: "primaryHover",
          },
        })
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
