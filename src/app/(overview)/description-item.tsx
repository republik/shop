"use client";
import { css } from "@/theme/css";
import { ReactNode, useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import { CheckIcon, InfoIcon } from "lucide-react";

export function DescriptionItem({
  children,
  info,
}: {
  children: ReactNode;
  info?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root
      className="CollapsibleRoot"
      open={open}
      onOpenChange={setOpen}
    >
      <li
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: "4",
        })}
      >
        <div
          className={css({
            flexGrow: "0",
            flexShrink: "0",
          })}
        >
          <CheckIcon />
        </div>
        <div
          className={css({
            flexGrow: "1",
          })}
        >
          {children}
          {info && (
            <Collapsible.Content className={css({})}>
              <div className={css({ fontSize: "md" })}>{info}</div>
            </Collapsible.Content>
          )}
        </div>
        {info && (
          <>
            <Collapsible.Trigger asChild>
              <Button
                variant="ghost"
                className={css({
                  flexGrow: "0",
                  flexShrink: "0",
                  p: "0",
                })}
              >
                <InfoIcon />
              </Button>
            </Collapsible.Trigger>
          </>
        )}
      </li>
    </Collapsible.Root>
  );
}
