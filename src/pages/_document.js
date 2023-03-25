import { Html, Head, Main, NextScript } from "next/document";
import { Theme } from "react-daisyui";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Theme
        color="light"
        className="scroll-smooth bg-slate-100 font-poppins text-slate-900"
      >
        <body>
          <Main />
          <NextScript />
        </body>
      </Theme>
    </Html>
  );
}
