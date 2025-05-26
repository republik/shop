import { css } from "@/theme/css";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ReactNode } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={css({
          backgroundColor: "overlay",
          position: "fixed",
          color: "text",
          inset: "0",
          display: "grid",
          placeItems: "end center",
          overflowY: "auto",
          zIndex: 9999,

          _stateOpen: { animation: "fadeIn" },
          _stateClosed: {
            animation: "fadeOut",
          },
          sm: {
            placeItems: "center",
          },
        })}
      >
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={css({
            position: "relative",
            boxShadow: "sm",
            background: "background",
            width: "full",
            p: "8",
            _stateOpen: {
              animation: "slideUp",
            },
            _stateClosed: {
              animation: "slideDown",
            },

            sm: {
              width: "content.narrow",
              _stateOpen: { animation: "slideIn" },
              _stateClosed: {
                animation: "slideOut",
              },
            },
          })}
        >
          <div
            className={css({
              display: "grid",
              gap: "4",
              gridTemplateColumns: "1fr max-content",
              alignItems: "start",
              mb: "4",
            })}
          >
            <DialogPrimitive.Title className={css({ textStyle: "h3Sans" })}>
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className={css({})} aria-label="Schliessen">
              <XIcon />
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  );
}
