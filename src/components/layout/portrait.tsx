"use client";

import { useQuery } from "@apollo/client";
import {
  MeDocument,
  MeQuery,
} from "../../../graphql/republik-api/__generated__/gql/graphql";
import { Skeleton } from "../ui/skeleton";

export function Portrait() {
  const { data, loading } = useQuery<MeQuery>(MeDocument);
  return (
    <div className="h-8 w-8">
      {loading ? (
        <Skeleton className="h-8 w-8" />
      ) : (
        <>
          {data?.me?.portrait ? (
            <img src={data.me.portrait} alt="Portrait" className="h-8 w-8" />
          ) : (
            <div className="h-8 w-8 bg-gray-300/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
              >
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                >
                  {data?.me?.initials || data?.me?.email?.[0] || "👻"}
                </text>
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
}
