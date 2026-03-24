import { css } from "@/theme/css";
import Link from "next/link";
import { CampaignReferralsDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client-server";
import CampaignMembershipsCounter from "@/components/campaign/counter";
import { Offers } from "@/components/campaign/offers";
import { Logo } from "@/components/logo";

async function CampaignBanner() {
  const gql = await getClient();
  const { data } = await gql.query(CampaignReferralsDocument, {});

  if (!data?.campaign?.isActive) return null;

  return (
    <div
      style={{
        color: "#F0084C",
        backgroundColor: "#FED9E1",
      }}
    >
      <div
        className={css({
          maxWidth: "content.narrow",
          mx: "auto",
          pt: "4",
          pb: "6",
          px: "8",
          md: {
            pt: "6",
          },
          lg: {
            py: "8",
            px: "0",
          },
        })}
      >
        <CampaignMembershipsCounter
          membersCount={data?.campaign?.newMembers?.count}
        />
        <h2
          className={css({
            fontSize: "3xl",
            fontFamily: "republikSerif",
            lineHeight: "[1.1]",
            mt: "12",
            mb: "2",
            md: { mb: "4" },
          })}
        >
          Mit 2000&nbsp;neuen Mitgliedern lösen wir 3&nbsp;Versprechen ein.
        </h2>
        <p
          className={css({
            fontSize: "xl",
            fontWeight: "medium",
            mb: "0",
            md: { mb: "4" },
          })}
        >
          Kommen Sie bis zum 14.&nbsp;April an Bord.
        </p>
        <p
          className={css({
            fontSize: "lg",
            mb: "6",
          })}
        >
          Sie bestimmen, wie viel Sie im ersten Jahr zahlen:
        </p>
        <Offers />
        <p
          className={css({
            textAlign: "center",
            mt: "6",
          })}
        >
          Jederzeit kündbar
        </p>
      </div>
    </div>
  );
}

export default CampaignBanner;
