import { Skeleton } from "@/components/ui/skeleton";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <main className="">{children}</main>;
}
