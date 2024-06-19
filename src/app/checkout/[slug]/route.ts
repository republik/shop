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

    const [product, price] = await Promise.all([
      stripe.products.retrieve(aboConfig.productId).catch((err) => {
        console.error("Failed to retrieve product", err);
        throw err;
      }),
      stripe.prices.retrieve(aboConfig.priceId).catch((err) => {
        console.error("Failed to retrieve price", err);
        throw err;
      }),
    ]);

    if (!price.unit_amount || !price.recurring) {
      throw new Error("Missing unit amount or recurring");
    }

    // Create link
    const session = await stripe.checkout.sessions.create({
      success_url: new URL(
        `/checkout/${params.slug}/success`,
        process.env.NEXT_PUBLIC_URL
      ).toString(),
      cancel_url: new URL(
        `/checkout/cancel`,
        process.env.NEXT_PUBLIC_URL
      ).toString(),
      line_items: [
        {
          price_data: {
            currency: "chf",
            product: product.id,
            unit_amount: price.unit_amount!,
            recurring: {
              interval: price.recurring.interval,
              interval_count: price.recurring.interval_count,
            },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      billing_address_collection: "required",
      // discounts: couponCode ? [{ coupon: couponCode }] : undefined,

      mode: "subscription",
      locale: "de",
      customer_email: data?.me?.email || undefined,
    });

    if (!session.url) {
      // TODO: handle this error properly
      throw new Error("No session URL");
    }

    return NextResponse.redirect(session.url, { status: 307 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
