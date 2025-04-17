"use server";

import type { OfferCheckoutQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import { fetchMe } from "@/lib/auth/fetch-me";
import type { Me } from "@/lib/auth/types";
import { fetchOffer } from "@/lib/offers";
import { checkIfUserCanPurchase } from "@/lib/product-purchase-guards";
import {
  type CheckoutSessionData,
  getCheckoutSession,
} from "@/lib/stripe/server";

type Offer = NonNullable<OfferCheckoutQuery["offer"]>;

type CheckoutState =
  | {
      step: "LOGIN";
      offer: Offer;
    }
  | {
      step: "UNAVAILABLE";
      offer: Offer;
      reason?: string;
      me?: Me;
    }
  | {
      step: "INITIAL";
      offer: Offer;
      me?: Me;
      checkoutSession?: CheckoutSessionData;
      totalSteps: number;
      currentStep: number;
      requiresInfo: boolean;
    }
  | {
      step: "INFO";
      offer: Offer;
      addressRequired: boolean;
      checkoutSession: CheckoutSessionData;
      me: Me;
      totalSteps: number;
      currentStep: number;
    }
  | {
      step: "PAYMENT";
      offer: Offer;
      checkoutSession: CheckoutSessionData;
      me?: Me;
      returnFromCheckout?: boolean;
      totalSteps: number;
      currentStep: number;
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
      me?: Me;
    };

export async function getCheckoutState({
  step,
  offerId,
  sessionId,
  promoCode,
  returnFromCheckout,
}: {
  step: string | undefined;
  offerId: string;
  sessionId?: string;
  promoCode?: string;
  returnFromCheckout?: boolean;
}): Promise<CheckoutState> {
  const offer = await fetchOffer(offerId, promoCode);

  if (!offer) {
    return {
      step: "ERROR",
      error: "NOT_FOUND",
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

  // FIXME Replace ID check with something?
  const requiresInfo =
    offer.id !== "DONATION" && offer.requiresLogin ? true : false;

  const totalSteps = requiresInfo ? 3 : 2;

  if (offer.requiresLogin && !me) {
    return {
      step: "LOGIN",
      offer,
    };
  }

  const productAvailability = checkIfUserCanPurchase({ me, offer });

  if (!productAvailability.available) {
    return {
      step: "UNAVAILABLE",
      reason: productAvailability.reason,
      offer,
    };
  }

  if (!checkoutSession) {
    return {
      step: "INITIAL",
      offer,
      me,
      totalSteps,
      currentStep: 1,
      requiresInfo,
    };
  }

  // Only show this step if login is required
  if (
    checkoutSession.status === "open" &&
    step === "info" &&
    requiresInfo &&
    me
  ) {
    return {
      step: "INFO",
      offer,
      addressRequired: offer.requiresAddress ?? false,
      checkoutSession,
      me,
      totalSteps,
      currentStep: 2,
    };
  }

  if (checkoutSession.status === "open" && step === "payment") {
    return {
      step: "PAYMENT",
      offer,
      checkoutSession,
      returnFromCheckout,
      totalSteps,
      currentStep: totalSteps, // always the last step
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
      me,
    };
  }

  return {
    step: "INITIAL",
    offer,
    me,
    totalSteps,
    checkoutSession,
    currentStep: 1,
  };
}
