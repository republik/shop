import { css, cx } from "@/theme/css";
import { OTPInput, SlotProps } from "input-otp";
import { ComponentPropsWithoutRef } from "react";

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-white" />
    </div>
  );
}

export function CodeInput(
  props: Omit<
    ComponentPropsWithoutRef<typeof OTPInput>,
    "children" | "containerClassName" | "maxLength" | "render"
  >
) {
  return (
    <OTPInput
      {...props}
      containerClassName={css({
        display: "flex",
        flexDirection: "row",
        gap: "4",
      })}
      maxLength={6}
      render={({ slots }) => (
        <>
          {[
            [0, 3],
            [3, 6],
          ].map(([from, to]) => (
            <div
              key={`${from}-${to}`}
              className={css({
                display: "flex",
                flexDirection: "row",
                width: "max",
              })}
            >
              {slots.slice(from, to).map((slot, idx) => (
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
                      borderLeftWidth: "0px",
                      borderColor: "text",
                      padding: "4",
                      height: "12",
                      width: "12",
                      fontSize: "md",
                      _first: {
                        borderLeftRadius: "sm",
                        borderLeftWidth: "1px",
                      },
                      _last: {
                        borderRightRadius: "sm",
                      },
                    }),

                    !props.disabled &&
                      slot.isActive &&
                      css({
                        borderLeftWidth: "1px",
                        outline: "[solid]",
                      })
                  )}
                >
                  {slot.char && <div>{slot.char}</div>}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    />
  );
}
