import { Dialog, RadioGroup } from "radix-ui";
import { css } from "@/theme/css";
import type { ReactNode } from "react";
import { XIcon } from "lucide-react";

export function OptionsDialogContent({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
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
        <Dialog.Content
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
            <Dialog.Title className={css({ textStyle: "h3Sans" })}>
              {title}
            </Dialog.Title>
            <Dialog.Close className={css({})} aria-label="Schliessen">
              <XIcon />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
}
