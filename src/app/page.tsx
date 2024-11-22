import { OfferCardPrimary, OfferGrid } from "@/app/(overview)/offer";
import { Logo } from "@/components/logo";
import { css } from "@/theme/css";
import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <div
        className={css({
          background: "[#DFD6C7]",
          p: "16",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16",
        })}
      >
        <div
          className={css({
            width: "full",
            maxWidth: "breakpoint-sm",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8",
            fontSize: "xl",
          })}
        >
          <Link href={process.env.NEXT_PUBLIC_MAGAZIN_URL} title="Republik">
            <Logo />
          </Link>
          <div className={css({ textAlign: "center" })}>
            <p className={css({ fontWeight: "medium" })}>
              Unabhängiger Journalismus, finanziert von seinen Leserinnen und
              Lesern.
            </p>
            <p>So können Sie uns unterstützen.</p>
          </div>
        </div>

        <div
          className={css({
            width: "full",
            maxWidth: "breakpoint-lg",
            mx: "auto",
          })}
        >
          <OfferGrid>
            <OfferCardPrimary
              offerId="MONTHLY"
              color="#C2E6D6"
              background="#386447"
            />
            <OfferCardPrimary
              offerId="YEARLY"
              color="#9C0056"
              background="#FFADF7"
            />
          </OfferGrid>
        </div>
        <div
          className={css({
            width: "full",
            maxWidth: "breakpoint-sm",
            mx: "auto",

            fontSize: "lg",
          })}
        >
          <h2>Was Sie erwartet:</h2>
          <ul>
            <li>All</li>
            <li>die</li>
            <li>guten</li>
            <li>Gründe</li>
          </ul>
        </div>
      </div>

      <div
        className={css({
          width: "full",
          maxWidth: "breakpoint-lg",
          mx: "auto",
          mt: "16",
        })}
      >
        <h2
          className={css({
            textStyle: "h2Sans",
            textAlign: "center",
            marginBlock: "16",
          })}
        >
          Weitere Angebote
        </h2>
        <OfferGrid>
          <OfferCardPrimary offerId="BENEFACTOR" background="#FFC266" />
          <OfferCardPrimary offerId="STUDENT" background="#BBC8FF" />
        </OfferGrid>
      </div>
    </div>
  );
}
