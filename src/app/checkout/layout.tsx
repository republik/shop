import { Skeleton } from "@/components/ui/skeleton";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 px-8 gap-4 md:gap-12 lg:gap-16">
      <section className="space-y-8">
        <h1>Straight from the CMS</h1>
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </section>
      <main className="">{children}</main>
    </div>
  );
}
