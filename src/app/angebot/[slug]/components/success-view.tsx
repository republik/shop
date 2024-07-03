import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SuccessView() {
  // @TODO/BACKEND - only redirect after we have verified that the purchse was successful.
  return (
    <div>
      <h1>Kauf erfolgreich</h1>
      <Button asChild>
        <Link
          href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/einrichten?context=pledge&package=ABO`}
        >
          Zum Magazin
        </Link>
      </Button>
    </div>
  );
}
