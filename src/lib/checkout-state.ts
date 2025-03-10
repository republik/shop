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
      totalSteps: number;
      currentStep: number;
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
  donationOption,
  returnFromCheckout,
}: {
  step: string;
  offerId: string;
  sessionId?: string;
  promoCode?: string;
  donationOption?: string;
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

  if (offer.requiresLogin && !me) {
    return {
      step: "LOGIN",
      offer,
    };
  }

  const totalSteps = offer.requiresLogin ? 3 : 2;

  if (!checkoutSession) {
    const productAvailability = offer.requiresLogin
      ? checkIfUserCanPurchase(me)
      : { available: true };

    if (!productAvailability.available) {
      return {
        step: "UNAVAILABLE",
        reason: productAvailability.reason,
        offer,
      };
    }

    return {
      step: "INITIAL",
      offer,
      totalSteps,
      currentStep: 1,
    };
  }

  // Only show this step if login is required
  if (
    checkoutSession.status === "open" &&
    step === "info" &&
    offer.requiresLogin &&
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

  if (checkoutSession.status === "open") {
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
    totalSteps,
    currentStep: 1,
  };
}
