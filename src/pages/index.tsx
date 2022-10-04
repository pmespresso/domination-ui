import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

const Index: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Domination</title>
        <meta
          name="description"
          content="Simple, on-chain winner takes all board game."
        />
      </Head>
      <Header />
    </div>
  );
};

export default Index;
