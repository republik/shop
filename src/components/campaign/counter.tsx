"use client";

import { Progress } from "radix-ui";
import { css } from "@/theme/css";

const TARGET_MEMBERS = 2000;

function CampaignMembershipsCounter({
  membersCount = 0,
}: {
  membersCount?: number;
}) {
  const progress = (membersCount / TARGET_MEMBERS) * 100;

  return (
    <span>
      <Progress.Root
        className={css({
          position: "relative",
          overflow: "hidden",
          borderRadius: "lg",
          width: "full",
          mb: "1",
        })}
        style={{
          height: "8px",
          background: "rgba(240, 8, 76, 0.2)",
          // Fix overflow clipping in Safari
          // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
          transform: "translateZ(0)",
        }}
        value={progress}
      >
        <Progress.Indicator
          className={css({
            borderRadius: "lg",
            width: "full",
            height: "full",
          })}
          style={{
            transform: `translateX(-${100 - progress}%)`,
            backgroundColor: "#F0084C",
            transition: "transform 660ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        />
      </Progress.Root>
      <span
        className={css({ display: "flex", justifyContent: "space-between" })}
      >
        <span className={css({ fontWeight: "medium" })}>Neue Mitglieder</span>
        <span>
          <span className={css({ fontWeight: "medium" })}>{membersCount}</span>/
          {TARGET_MEMBERS}
        </span>
      </span>
    </span>
  );
}

export default CampaignMembershipsCounter;
