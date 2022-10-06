import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

// https://jonmeyers.io/blog/fix-client-server-hydration-error-in-next-js
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
import Board from "@/components/Board";

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
      <section className="container pt-12 h-96 w-screen  mx-auto my-0 ">
        <Board />
      </section>
    </div>
  );
};

export default Index;
