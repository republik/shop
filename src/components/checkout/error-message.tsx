"use client";
import { css } from "@/theme/css";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircleWarningIcon } from "lucide-react";

export function ErrorMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Alert variant="error">
      <MessageCircleWarningIcon
        className={css({
          height: "8",
          width: "8",
        })}
      />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
