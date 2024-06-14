"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { initPurchase } from "./action";
import { PageLayout } from "@/components/layout";

export default function Home() {
  return (
    <div className="flex flex-col justify-content items-center">
      <Button
        onClick={() => initPurchase().then(console.log)}
        className="bg-primary text-white"
      >
        Create monthly abo
      </Button>
    </div>
  );
}
