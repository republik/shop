import Link from "next/link";
import { css } from "@/theme/css";
import { container } from "@/theme/patterns";

function intersperse<T>(arr: T[], separator: (idx: number) => T): T[] {
  if (arr.length === 0) return [];

  const result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i]);
    if (i < arr.length - 1) {
      result.push(separator(i));
    }
  }

  return result;
}

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
    text: "Datenschutzbestimmung",
    href: `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/datenschutz`,
  },
  {
    text: "Kontakt",
    href: `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/kontakt`,
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
        color: "zinc.400",
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
        borderTopColor: "zinc.300",
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
          columnGap: "2",
          rowGap: "1",
          justifyContent: "center",
          fontSize: "xs",
        })}
      >
        {intersperse(footerLinkNodes, (idx: number) => (
          <span key={idx}>-</span>
        ))}
      </div>
    </footer>
  );
}
