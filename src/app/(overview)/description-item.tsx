"use client";
import { css } from "@/theme/css";
import {ReactNode, useState} from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import {CheckIcon, InfoIcon} from "lucide-react";

export function DescriptionItem({ children, info }: { children: ReactNode; info?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (<Collapsible.Root
    className="CollapsibleRoot"
    open={open}
    onOpenChange={setOpen}
  >
    <li className={css({
      mt: "3",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap"
    })}>
      <div className={css({
        flexGrow: "0",
        flexShrink: "0",
        marginTop: "3",
        mr: "4-8"
      })}>
        <CheckIcon />
      </div>
      <p className={css({
        flex: "1"
      })}>{children}</p>
      { info && <>
      <Collapsible.Trigger asChild>
        <Button variant="ghost" className={css({
          flexGrow: "0",
          flexShrink: "0",
          ml: "4-8"
        })}>
            <InfoIcon/>
        </Button>
        </Collapsible.Trigger>
      <Collapsible.Content className={css({ ml: "4-8", pl: "6" })}>
        <div className={css({ fontSize: "md" })}>{info}</div>
      </Collapsible.Content>
      </>}
    </li>
  </Collapsible.Root>)
}
