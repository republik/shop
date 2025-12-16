import Script from "next/script";

export function TallyFormEmbed({ url, title }: { url: string; title: string }) {
  return (
    <>
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />
      <iframe
        data-tally-src={url}
        loading="lazy"
        width="100%"
        title={title}
      ></iframe>
    </>
  );
}
