interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="container p-4 mx-auto">
        <p>header</p>
      </header>
      <main className="flex-grow h-full container p-4 mx-auto">{children}</main>
      <footer className="container p-4 mx-auto">
        <p>footer</p>
      </footer>
    </div>
  );
}
