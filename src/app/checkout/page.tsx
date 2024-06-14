import { PageLayout } from "@/components/layout";
import { Checkout } from "./components/form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {
  const clientSecret = cookies().get("checkout-clientSecret");
  if (!clientSecret) {
    // redirect to home
    // TODO: Add a toast message to inform the user
    return redirect("/");
  }

  return (
    <Suspense>
      <div className="flex flex-col justify-content">
        <Checkout clientSecret={clientSecret.value} />
      </div>
    </Suspense>
  );
}
