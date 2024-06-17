"use client";

import { useQuery } from "@apollo/client";
import { MeDocument } from "../../../graphql/republik-api/__generated__/gql/graphql";

export function Portrait() {
  const { data } = useQuery(MeDocument);
  return (
    <div className="h-8 w-8">
      {data?.me?.portrait ? (
        <img src={data.me.portrait} alt="Portrait" className="h-8 w-8" />
      ) : (
        <div className="h-8 w-8 bg-gray-300"></div>
      )}
    </div>
  );
}
