import getTranslation from "next-translate/useTranslation";
import { IsProductAvailableForUserPredicate } from "./stripe/types";
import { Me } from "@/lib/auth/types";

type SubscriptionType = "MONTHLY" | "YEARLY";

/**
 * Checks if the user can buy a monthly subscription based on their current
 * subscriptions and memberships.
 * @param me The user object
 * @returns An object with the availability status and a reason if not available
 */
const canUserBuyMonthlyAbo: IsProductAvailableForUserPredicate = (me) => {
  const { t } = getTranslation();

  if (me.magazineSubscriptions.length > 0 || me.activeMembership) {
    return {
      available: false,
      reason: t("checkout:preCheckout.unavailable.reasons.hasSubscription"),
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
  const { t } = getTranslation();

  if (me.magazineSubscriptions.length > 0 || me.activeMembership) {
    return {
      available: false,
      reason: t("checkout:preCheckout.unavailable.reasons.hasSubscription"),
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
  subscriptionType: SubscriptionType
): ReturnType<IsProductAvailableForUserPredicate> {
  if (subscriptionType === "MONTHLY") {
    return canUserBuyMonthlyAbo(me);
  }
  if (subscriptionType === "YEARLY") {
    return canUserBuyYearlyAbo(me);
  }

  return { available: false, reason: "Unknown subscription type" };
}
