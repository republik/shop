"use client";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  type AnchorHTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

type Props = Omit<LinkProps, "href"> & {
  children?: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

function SearchParamsLink(props: Props) {
  const searchParams = useSearchParams();
  const overviewHref = `/?${searchParams}`;

  return <Link {...props} href={overviewHref} />;
}

// A component using useSearchParams needs to be wrapped in <Suspense>
export function OverviewLink(props: Props) {
  return (
    <Suspense>
      <SearchParamsLink {...props} />
    </Suspense>
  );
}
