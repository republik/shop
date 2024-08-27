"use client";

import { css } from "@/theme/css";
import Link from "next/link";
import { toast } from "sonner";
import { useClient } from "urql";
import { SignOutDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Me } from "@/lib/auth/types";

type PortraitProps = {
  me: Me;
};

export function Portrait({ me }: PortraitProps) {
  const gql = useClient();

  function signOut() {
    const logoutPromise = async () => gql.mutation(SignOutDocument, {});
    toast.promise(
        logoutPromise()
          .then(() => window.location.reload()),
        {
          loading: "Sie werden abgemeldet…",
          success: "Sie wurden abgemeldet",
          error: "Fehler beim Abmelden",
        }
        );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            target="_blank"
            href={process.env.NEXT_PUBLIC_MAGAZIN_URL + "/konto"}
          >
            Mein Konto
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button onClick={() => signOut()}>Abmelden</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
