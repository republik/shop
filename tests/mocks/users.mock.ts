import { v4 } from "uuid";
import {
  MeQuery,
  Membership,
} from "#graphql/republik-api/__generated__/gql/graphql";

type User = NonNullable<MeQuery["me"]>;

export function mockUser(
  firstName: string,
  lastName: string,
  options: {
    memberships: (Pick<Membership, "__typename" | "id" | "endDate"> & {
      active?: boolean;
    })[];
    roles: string[];
  } = {
    memberships: [],
    roles: [],
  }
): User {
  return {
    id: v4(),
    firstName: firstName,
    lastName: lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    memberships: options.memberships,
    roles: options.roles,
    portrait: null,
    activeMembership: null,
    name: `${firstName} ${lastName}`,
    slug: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    initials: `${firstName[0]}${lastName[0]}`,
  };
}
