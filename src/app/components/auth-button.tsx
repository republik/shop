"use client";

import { useMutation, useQuery } from "@apollo/client";
import {
  MeDocument,
  SignOutDocument,
} from "../../../graphql/republik-api/__generated__/gql/graphql";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AuthButton() {
  const router = useRouter();
  const { data, loading, error } = useQuery(MeDocument);
  const [signOut] = useMutation(SignOutDocument);

  const handleClick = useCallback(() => {
    if (loading) {
      return;
    }

    if (error) {
      toast.error("Fehler beim Laden der Benutzerdaten");
      return;
    }

    if (!data?.me) {
      const currentUrl = window.location.href;
      const redirectUrl = new URL(
        "/anmelden",
        process.env.NEXT_PUBLIC_MAGAZIN_URL
      );
      redirectUrl.searchParams.append("redirect", currentUrl);
      toast("Sie werden weitergeleitet...");
      router.push(redirectUrl.toString());
      return;
    }

    signOut()
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Fehler beim Abmelden");
        console.error(error);
      });
  }, [loading, error, data?.me, signOut, router]);

  const text = data?.me ? "Logout" : "Login";

  return (
    <Button className="w-full" onClick={handleClick}>
      {loading ? "Laden..." : text}
    </Button>
  );
}
