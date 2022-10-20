import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import { configureChains, chain, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { GameStateContextProvider } from "@/GameStateContext";

function MyApp({ Component, pageProps }: AppProps) {
  const { chains, provider, webSocketProvider } = configureChains(
    [chain.polygonMumbai, chain.localhost],
    [publicProvider()]
  );

  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
  });

  return (
    <WagmiConfig client={client}>
      <GameStateContextProvider>
        <Component {...pageProps} />
      </GameStateContextProvider>
    </WagmiConfig>
  );
}

export default MyApp;
