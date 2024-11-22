import { OfferCardPrimary, OfferGrid } from "@/app/(overview)/offer";
import { css } from "@/theme/css";
import { redirect } from "next/navigation";

const OFFERS = [{ id: "YEARLY" }, { id: "MONTHLY" }];

export default async function Home() {
  return (
    <div
      className={css({
        width: "full",
        maxWidth: "breakpoint-xl",
      })}
    >
      <OfferGrid>
        <OfferCardPrimary
          offerId="MONTHLY"
          colorText="#C2E6D6"
          colorBackground="#386447"
        />
        <OfferCardPrimary
          offerId="YEARLY"
          colorText="#9C0056"
          colorBackground="#FFADF7"
        />
      </OfferGrid>
      Blah
      <OfferGrid>
        <OfferCardPrimary
          offerId="BENEFACTOR"
          // colorText="#C2E6D6"
          colorBackground="#BBC8FF"
        />
        <OfferCardPrimary offerId="STUDENT" />
      </OfferGrid>
    </div>
  );
}
