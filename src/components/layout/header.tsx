import { Logo } from "@/components/logo";
import { css } from "@/theme/css";
import Link from "next/link";

export async function Header() {
  return (
    <header
      className={css({
        display: "flex",
        justifyContent: "center",
        py: "4",
        px: "4",
        borderBottomColor: "divider",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
      })}
    >
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <Link href={process.env.NEXT_PUBLIC_MAGAZIN_URL} title="Republik">
          <Logo />
        </Link>
      </div>
      {/* <div>{me && <Portrait me={me} />}</div> */}
    </header>
  );
}
