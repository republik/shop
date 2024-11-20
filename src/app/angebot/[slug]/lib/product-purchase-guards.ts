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
  if (me.activeMagazineSubscription || me.activeMembership) {
    return {
      available: false,
      reason: "hasSubscription",
    };
  }

  return { available: true };
};

/**
 * Checks if the user can buy a yearly subscription based on their current
 * subscriptions and memberships.
 * @param me The user object
 * @returns An object with the availability status and a reason if not available
 */
const canUserBuyYearlyAbo: IsProductAvailableForUserPredicate = (me) => {
  if (me.activeMagazineSubscription || me.activeMembership) {
    return {
      available: false,
      reason: "hasSubscription",
    };
  }
  return { available: true };
};

/**
 * Checks if the user can buy a subscription based on their current
 * subscriptions and memberships.
 * @param me The user object
 * @param subscriptionType The type of subscription to check
 * @returns An object with the availability status and a reason if not available
 */
export function checkIfUserCanPurchase(
  me: Me,
  subscriptionType: string
): ReturnType<IsProductAvailableForUserPredicate> {
  if (subscriptionType === "MONTHLY") {
    return canUserBuyMonthlyAbo(me);
  }
  if (subscriptionType === "YEARLY") {
    return canUserBuyYearlyAbo(me);
  }

  return { available: false };
}
