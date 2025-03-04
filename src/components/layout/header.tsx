import { Logo } from "@/components/logo";
import { css, cx } from "@/theme/css";
import Link from "next/link";

export async function Header() {
  return (
    <header
      className={cx(
        css({
          display: "flex",
          justifyContent: "center",
          py: "4",
          px: "4",
        })
      )}
    >
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <Link href={process.env.NEXT_PUBLIC_URL}>
          <Logo />
        </Link>
      </div>
      {/* <div>{me && <Portrait me={me} />}</div> */}
    </header>
  );
}
