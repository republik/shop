import { css, cx } from "@/theme/css";
import { OTPInput } from "input-otp";
import { ComponentPropsWithoutRef, RefObject } from "react";

export function CodeInput({
  formRef,
  ...props
}: Omit<
  ComponentPropsWithoutRef<typeof OTPInput>,
  "children" | "containerClassName" | "maxLength" | "render"
> & { formRef: RefObject<HTMLFormElement> }) {
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
      onPaste={(e) => {
        const pastedText = e.clipboardData.getData("text/plain");
        const trimmedText = pastedText.trim().replace(/[-.,_ ]/g, "");
        if (trimmedText.length === 6) {
          props.onChange?.(trimmedText);
        }
      }}
      onComplete={() => {
        // Safari < 16 doesn't support requestSubmit(), user needs to press submit button manually
        formRef.current?.requestSubmit?.();
      }}
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
                  borderColor: "text",
                  borderRadius: "md",
                  padding: "2",
                  height: "12",
                  width: "10",
                  fontSize: "md",
                }),

                !props.disabled &&
                  slot.isActive &&
                  css({
                    outline: "[solid]",
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
