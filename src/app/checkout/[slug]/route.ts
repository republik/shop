import { NextRequest, NextResponse } from "next/server";
import { MeDocument } from "../../../../graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/apollo/client";
import { initStripe } from "./lib/stripe/server";
import { checkoutConfig } from "./lib/config";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { slug: string };
  }
): Promise<NextResponse> {
  try {
    const client = getClient();
    const { data } = await client.query({
      query: MeDocument,
    });
    console.log(data);
    // Send to login page if user is not logged in, and redirect back to checkout after login
    if (!data.me) {
      const url = new URL("/anmelden", process.env.NEXT_PUBLIC_MAGAZIN_URL);
      const afterLoginUrl = new URL(
        `/checkout/${params.slug}`,
        process.env.NEXT_PUBLIC_URL
      );
      url.searchParams.append("redirect", afterLoginUrl.toString());

      return NextResponse.redirect(url.toString(), { status: 307 });
    }
    if (!checkoutConfig[params.slug]) {
      // TODO: ERROR, KAPUTT, WHERE TO GO
      return NextResponse.redirect("/", { status: 307 });
    }
    const aboConfig = checkoutConfig[params.slug];
    const stripe = initStripe(aboConfig.stripeAccount);

    // Create link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: aboConfig.priceId,
          quantity: 1,
        },
      ],
      billing_address_collection: "required",
      after_completion: {
        redirect: {
          url: new URL(
            `/checkout/${params.slug}/success`,
            process.env.NEXT_PUBLIC_URL
          ).toString(),
        },
        type: "redirect",
      },
    });
    //TODO: handle error

    return NextResponse.redirect(paymentLink.url, { status: 307 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
