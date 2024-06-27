"use client";

import { MeQuery } from "../../../graphql/republik-api/__generated__/gql/graphql";

type PortraitProps = {
  me: MeQuery["me"];
};

export function Portrait({ me }: PortraitProps) {
  return (
    <div className="h-8 w-8">
      {me?.portrait ? (
        <img src={me.portrait} alt="Portrait" className="h-8 w-8" />
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
              {me?.initials || me?.email?.[0] || "👻"}
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}
