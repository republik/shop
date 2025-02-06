import { Me } from "@/lib/auth/types";

type ProductAvailabilityResult = {
  available: boolean;
  reason?: string;
};

export type IsProductAvailableForUserPredicate = (
  me: Me
) => ProductAvailabilityResult;

/**
 * Checks if the user can buy a monthly subscription based on their current
 * subscriptions and memberships.
 * @param me The user object
 * @returns An object with the availability status and a reason if not available
 */
const canUserBuyMonthlyAbo: IsProductAvailableForUserPredicate = (me) => {
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
};

/**
 * Checks if the user can buy a yearly subscription based on their current
 * subscriptions and memberships.
 * @param me The user object
 * @returns An object with the availability status and a reason if not available
 */
const canUserBuyYearlyAbo: IsProductAvailableForUserPredicate = (me) => {
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
};

/**
 * Checks if the user can buy a subscription based on their current
 * subscriptions and memberships.
 * @param me The user object
 * @param offerId The type of subscription to check
 * @returns An object with the availability status and a reason if not available
 */
export function checkIfUserCanPurchase(
  me: Me,
  offerId: string
): ReturnType<IsProductAvailableForUserPredicate> {
  if (offerId === "MONTHLY") {
    return canUserBuyMonthlyAbo(me);
  }
  if (offerId === "YEARLY") {
    return canUserBuyYearlyAbo(me);
  }

  return { available: false };
}
