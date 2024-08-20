import { MagazineSubscriptionStatus } from "./../../graphql/republik-api/__generated__/gql/graphql";
import { v4 } from "uuid";
import { Me } from "@/lib/auth/types";

export function mockUser(
  firstName: string,
  lastName: string,
  options: Pick<Me, "memberships" | "roles" | "magazineSubscriptions"> = {
    magazineSubscriptions: [],
    memberships: [],
    roles: [],
  }
): Me {
  return {
    id: v4(),
    firstName: firstName,
    lastName: lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    portrait: null,
    name: `${firstName} ${lastName}`,
    slug: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    initials: `${firstName[0]}${lastName[0]}`,
    roles: options.roles,
    magazineSubscriptions: options.magazineSubscriptions,
    activeMagazineSubscription:
      options.magazineSubscriptions.find(
        (subscription) =>
          subscription.status === MagazineSubscriptionStatus.Active
      ) || null,
    memberships: options.memberships,
    activeMembership:
      options.memberships.find((membership) => membership.active) || null,
  };
}
