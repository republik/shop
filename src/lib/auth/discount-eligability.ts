import { Me } from "./types";

export function isEligibleForCoupon(me: Me | null): boolean {
  if (!me) {
    return true;
  }

  return (
    me && me.magazineSubscriptions.length === 0 && me.activeMembership === null
  );
}
