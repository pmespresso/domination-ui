import { Head, Html, Main, NextScript } from "next/document";

export default function Document(props: any) {
  let pageProps = props.__NEXT_DATA__?.props?.pageProps;

  return (
    <Html
      className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']"
      lang="en"
    >
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lexend:wght@400;500&display=swap"
        />
      </Head>
      <body className="flex flex-col justify-center align-middle h-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-800 mx-auto bg-cover bg-center">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
