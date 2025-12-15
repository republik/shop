import Script from "next/script";

export function TallyFormEmbed({ url, title, height }: { url: string, title: string, height: number }) {
  return (
    <>
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="lazyOnload"
      />
      <iframe
        data-tally-src={url}
        loading="lazy"
        width="100%"
        height={height}
        title={title}
      ></iframe>
    </>
  );
}
