import { css, cx } from "@/theme/css";
import { button } from "@/theme/recipes";
import Link from "next/link";
import {CampaignReferralsDocument} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client-server";
import CampaignMembershipsCounter from "@/components/campaign/counter";

async function CampaignBanner() {
  const gql = await getClient();
  const { data } = await gql.query(CampaignReferralsDocument, {});

  if (!data?.campaign?.isActive) return null;

  return (
    <div
      style={{
        color: "#F0084C",
        backgroundColor: "#FED9E1",
        boxShadow: "shadows.sm",
      }}
    >
      <div
        className={css({
          maxWidth: "content.wide",
          mx: "auto",
          pt: "4",
          pb: "6",
          px: "8",
          md: {
            pt: "6",
          },
          lg: {
            py: "8",
            px: "0"
          }
        })}
      >
        <CampaignMembershipsCounter membersCount={data?.campaign?.newMembers?.count} />
        <div
          className={css({
            mt: "1",
            md: {
              mt: "4",
              display: "flex",
              alignItems: "center",
              gap: "4",
            },
          })}
        >
          <p
            className={css({
              textAlign: "center",
              fontFamily: "gtAmericaStandard",
              textStyle: "serifBold",
              lineHeight: "tight",
              fontSize: "xl",
              py: "2",
              mb: "2",
              md: {
                textAlign: "left",
                fontSize: "3xl",
                lineHeight: "1",
                py: "0",
                mb: "0",
              },
            })}
          >
            Mit 2000&nbsp;neuen Mitgliedern lösen wir 3&nbsp;Versprechen ein.
            Machen Sie mit?
          </p>
          <div className={css({ textAlign: "center", ml: "auto" })}>
            <Link
              href="https://www.republik.ch/versprechen"
              style={{ background: "#F0084C", borderColor: "#F0084C" }}
              className={cx(
                button(),
                css({
                  color: "white",
                }),
              )}
            >
              Jetzt 50 % günstiger
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignBanner;
