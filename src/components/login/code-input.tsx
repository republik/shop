import { css, cx } from "@/theme/css";
import { OTPInput } from "input-otp";
import { ComponentPropsWithoutRef, RefObject } from "react";

export function CodeInput({
  ...props
}: Omit<
  ComponentPropsWithoutRef<typeof OTPInput>,
  "children" | "containerClassName" | "maxLength" | "render"
>) {
  return (
    <OTPInput
      {...props}
      autoFocus
      containerClassName={css({
        display: "flex",
        flexDirection: "row",
        gap: "2",
      })}
      maxLength={6}
      // pushPasswordManagerStrategy="none"
      render={({ slots }) => (
        <>
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className={cx(
                css({
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: "1px",
                  borderColor: "divider",
                  borderRadius: "md",
                  padding: "2",
                  height: "12",
                  width: "10",
                  fontSize: "md",
                }),

                !props.disabled &&
                  slot.isActive &&
                  css({
                    outlineStyle: "solid",
                    outlineColor: "text",
                    outlineWidth: "2px",
                  })
              )}
            >
              {slot.char && <div>{slot.char}</div>}
            </div>
          ))}
        </>
      )}
    />
  );
}
