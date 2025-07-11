"use client";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { CheckIcon, InfoIcon } from "lucide-react";
import { Collapsible } from "radix-ui";
import { type ReactNode, useState } from "react";

export function DescriptionItem({
  icon = <CheckIcon />,
  children,
  info,
}: {
  icon?: ReactNode;
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
          {icon}
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
                variant="link"
                className={css({
                  flexGrow: "0",
                  flexShrink: "0",
                  p: "0",
                  textDecoration: "none",
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
