import { MeQuery } from "#graphql/republik-api/__generated__/gql/graphql";

export type Me = NonNullable<MeQuery["me"]>;
