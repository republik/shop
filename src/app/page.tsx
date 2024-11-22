import { OfferCardPrimary, OfferGrid } from "@/app/(overview)/offer";
import { css } from "@/theme/css";
import { redirect } from "next/navigation";

const OFFERS = [{ id: "YEARLY" }, { id: "MONTHLY" }];

export default async function Home() {
  return (
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
      Blah
      <OfferGrid>
        <OfferCardPrimary offerId="BENEFACTOR" background="#FFC266" />
        <OfferCardPrimary offerId="STUDENT" background="#BBC8FF" />
      </OfferGrid>
    </div>
  );
}
