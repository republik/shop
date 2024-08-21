import { Me } from "./types";

/**
 * Simple check against the me object to determine if the user is eligible for an entry coupon.
 * @param me The user object.
 * @returns Whether the user is eligible for an entry coupon.
 */
export function isEligibleForEntryCoupon(me: Me | null): boolean {
  if (!me) {
    return true;
  }

  return me.activeMembership === null && me.magazineSubscriptions.length === 0;
}
