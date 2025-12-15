import { LoginStatus } from "@/components/login/login-status";
import { css } from "@/theme/css";
import { container } from "@/theme/patterns";
import Link from "next/link";

type Link = {
  text: string;
  href: string;
};

const footerLinks: Link[] = [
  {
    text: "Republik Magazin",
    href: `${process.env.NEXT_PUBLIC_MAGAZIN_URL}`,
  },
  {
    text: "Datenschutz",
    href: `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/datenschutz`,
  },
  {
    text: "Kontakt",
    href: `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/impressum`,
  },
  {
    text: "Hilfe",
    href: `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/faq`,
  },
];

export async function Footer() {
  const footerLinkNodes = footerLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={css({
        textAlign: "center",
        _hover: {
          textDecoration: "underline",
        },
      })}
    >
      {link.text}
    </Link>
  ));

  return (
    <footer
      className={css({
        borderTopColor: "divider",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
      })}
    >
      <div
        className={container({
          py: "4",
          px: "6",
          color: "[rgba(0, 0, 0, 0.50)]",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          columnGap: "4",
          rowGap: "1",
          justifyContent: "center",
          fontSize: "xs",
          textAlign: "center",
        })}
      >
        {footerLinkNodes}
        <LoginStatus />
      </div>
    </footer>
  );
}
