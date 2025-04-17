import type { OfferCheckoutQuery } from "#graphql/republik-api/__generated__/gql/graphql";
import type { Me } from "@/lib/auth/types";

type ProductAvailabilityResult = {
  available: boolean;
  reason?: string;
};

/**
 * Checks if the user can buy a subscription based on their current
 * subscriptions and memberships.
 * @param {me, offer} The user and offer object
 * @returns An object with the availability status and a reason if not available
 */
export function checkIfUserCanPurchase({
  me,
  offer,
}: {
  me?: Me;
  offer: NonNullable<OfferCheckoutQuery["offer"]>;
}): ProductAvailabilityResult {
  // Offers that don't require a login are always available
  if (!offer.requiresLogin) {
    return { available: true };
  }

  // If a user is not logged in, there's nothing to check
  if (!me) {
    return { available: false };
  }

  if (offer.id === "DONATION") {
    const userIsProjectRMember =
      me.activeMagazineSubscription?.company === "PROJECT_R" ||
      ["ABO", "BENEFACTOR"].includes(me.activeMembership?.type.name ?? "");

    return {
      available: userIsProjectRMember,
      reason: "needsMembershipForDonation",
    };
  }

  // Subscriptions
  if (me.activeMagazineSubscription) {
    return {
      available: false,
      reason: "hasSubscription",
    };
  }

  // Legacy memberships
  // Check if membership has ended, i.e. membership is in grace period. In this case we allow buying a new subscription.
  const legacyMembershipHasEnded =
    me.activeMembership?.endDate &&
    new Date(me.activeMembership?.endDate).getTime() < Date.now();

  if (me.activeMembership && !legacyMembershipHasEnded) {
    return {
      available: false,
      reason: "hasSubscription",
    };
  }

  // Go!
  return { available: true };
}
