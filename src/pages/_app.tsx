import Head from "next/head";
import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Pacman Kanji</title>
        <meta
          name="description"
          content="Learn Japanese kanji by playing Pacman!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
