"use client";
import { Button } from "@/components/ui/button";
import { initPurchase } from "./action";
import { Login } from "@/components/login";

export default function Home() {
  return (
    <div className="flex flex-col justify-content items-center">
      <Button
        onClick={() => initPurchase().then(console.log)}
        className="bg-primary text-white"
      >
        Create monthly abo
      </Button>
      <Login />
    </div>
  );
}
