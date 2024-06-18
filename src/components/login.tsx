"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function Login() {
  const router = useRouter();

  const handleClick = () => {
    const currentUrl = window.location.href;

    const redirectUrl = new URL(
      "/anmelden",
      process.env.NEXT_PUBLIC_MAGAZIN_URL
    );
    redirectUrl.searchParams.append("redirect", currentUrl);
    window.location.assign(redirectUrl.toString());
  };

  return <Button onClick={() => handleClick()}>Login</Button>;
}
