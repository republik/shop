"use client";

import { css } from "@/theme/css";
import {
  MeQuery,
  SignOutMutation,
} from "../../../graphql/republik-api/__generated__/gql/graphql";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import Link from "next/link";
import { useCallback } from "react";
import { toast } from "sonner";

type PortraitProps = {
  me: MeQuery["me"];
  handleSignOut: () => Promise<SignOutMutation>;
};

export function Portrait({ me, handleSignOut }: PortraitProps) {
  const signOut = useCallback(() => {
    handleSignOut()
      .then(() => window.location.reload())
      .catch(() =>
        toast.error("Abmelden fehlgeschlagen.", {
          description: "Bitte Versuchen Sie es erneut",
        })
      );
  }, [handleSignOut]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={css({
            height: "8",
            width: "8",
          })}
        >
          {me?.portrait ? (
            <img
              src={me.portrait}
              alt="Portrait"
              className={css({
                height: "8",
                width: "8",
              })}
            />
          ) : (
            <div
              className={css({
                bg: "disabled",
                height: "8",
                width: "8",
              })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={css({
                  height: "8",
                  width: "8",
                })}
              >
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                >
                  {me?.initials || me?.email?.[0] || "👻"}
                </text>
              </svg>
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Button variant="ghost" asChild>
              <Link
                target="_blank"
                href={process.env.NEXT_PUBLIC_MAGAZIN_URL + "/konto"}
              >
                Mein Konto
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => signOut()}>
              Abmelden
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
