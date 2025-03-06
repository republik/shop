"use server";

import { OfferCheckoutQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { fetchMe } from "@/lib/auth/fetch-me";
import { Me } from "@/lib/auth/types";
import { fetchOffer } from "@/lib/offers";
import { checkIfUserCanPurchase } from "@/lib/product-purchase-guards";
import {
  CheckoutSessionData,
  expireCheckoutSession,
  getCheckoutSession,
} from "@/lib/stripe/server";
import { redirect } from "next/navigation";

type Offer = NonNullable<OfferCheckoutQuery["offer"]>;

type CheckoutState =
  | {
      step: "LOGIN";
      offer: Offer;
      checkoutSession: undefined;
      me?: undefined;
    }
  | {
      step: "INITIAL";
      offer: Offer;
      checkoutSession: undefined;
      me?: Me;
    }
  | {
      step: "UNAVAILABLE";
      offer: Offer;
      reason?: string;
      checkoutSession: undefined;
      me?: Me;
    }
  | {
      step: "INFO";
      offer: Offer;
      addressRequired: boolean;
      checkoutSession: CheckoutSessionData;
      me: Me;
    }
  | {
      step: "PAYMENT";
      offer: Offer;
      checkoutSession: CheckoutSessionData;
      me?: Me;
      returnFromCheckout?: boolean;
    }
  | {
      step: "SUCCESS";
      offer: Offer;
      checkoutSession: CheckoutSessionData;
      me?: Me;
    }
  | {
      step: "ERROR";
      error: "NOT_FOUND" | "EXPIRED";
      offer?: Offer;
      checkoutSession: undefined;
      me?: Me;
    };

export async function getCheckoutState({
  step,
  offerId,
  sessionId,
  promoCode,
  donateOption,
  returnFromCheckout,
}: {
  step: string;
  offerId: string;
  sessionId?: string;
  promoCode?: string;
  donateOption?: string;
  returnFromCheckout?: boolean;
}): Promise<CheckoutState> {
  const offer = await fetchOffer(offerId, promoCode);

  if (!offer) {
    return {
      step: "ERROR",
      error: "NOT_FOUND",
      offer: undefined,
      checkoutSession: undefined,
      me: undefined,
    };
  }

  const { company } = offer;

  const me = await fetchMe(company);

  const checkoutSession = sessionId
    ? await getCheckoutSession(
        company,
        sessionId,
        me?.stripeCustomer?.customerId
      )
    : undefined;

  if (offer.requiresLogin && !me) {
    return {
      step: "LOGIN",
      offer,
      checkoutSession: undefined,
    };
  }

  const productAvailability = offer.requiresLogin
    ? checkIfUserCanPurchase(me)
    : { available: true };

  if (!productAvailability.available) {
    return {
      step: "UNAVAILABLE",
      reason: productAvailability.reason,
      offer,
      checkoutSession: undefined,
    };
  }

  if (!checkoutSession) {
    return {
      step: "INITIAL",
      offer,
      checkoutSession: undefined,
    };
  }

  if (checkoutSession.status === "open" && step === "info" && me) {
    return {
      step: "INFO",
      offer,
      addressRequired: offer.company === "PROJECT_R",
      checkoutSession,
      me,
    };
  }

  if (checkoutSession.status === "open") {
    return {
      step: "PAYMENT",
      offer,
      checkoutSession,
      returnFromCheckout,
    };
  }

  if (checkoutSession.status === "complete") {
    return {
      step: "SUCCESS",
      offer,
      checkoutSession,
    };
  }

  if (checkoutSession.status === "expired") {
    return {
      step: "ERROR",
      error: "EXPIRED",
      offer,
      checkoutSession: undefined,
      me,
    };
  }

  return {
    step: "INITIAL",
    offer,
    checkoutSession: undefined,
  };
}
