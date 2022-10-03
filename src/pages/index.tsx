import type { NextPage } from "next";
import Head from "next/head";
import { configureChains, chain, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const Home: NextPage = () => {
  const { chains, provider, webSocketProvider } = configureChains(
    [chain.mainnet, chain.polygon],
    [publicProvider()]
  );

  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
  });

  return (
    <>
      <Head>
        <title>Domination</title>
        <meta
          name="description"
          content="Simple, on-chain winner takes all board game."
        />
      </Head>
      <WagmiConfig client={client}>
        <main className="container bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto bg-cover bg-center h-px w-px">
          <p className="text-sky-400">{chain.arbitrum.name}</p>
        </main>
      </WagmiConfig>
    </>
  );
};

export default Home;
