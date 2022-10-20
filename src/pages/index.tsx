import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

// https://jonmeyers.io/blog/fix-client-server-hydration-error-in-next-js
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
import Board from "@/components/Board";
import { contracts } from "@/constants";
const Connect = dynamic(() => import("@/components/Connect"), { ssr: false });
import { BigNumber } from "ethers";
import { useAccount, useContractReads } from "wagmi";
import { formatGameStartTime } from "@/utils";

const Index: NextPage = () => {
  const { address } = useAccount();

  const mumbaiGame = {
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: contracts.mumbai.abis.game,
    watch: true,
  };

  const { data, isLoading, isSuccess } = useContractReads({
    contracts: [
      {
        ...mumbaiGame,
        functionName: "currentTurn",
      },
      {
        ...mumbaiGame,
        functionName: "spoils",
        args: [address],
      },
      {
        ...mumbaiGame,
        functionName: "gameStartTimestamp",
      },
      {
        ...mumbaiGame,
        functionName: "activePlayersCount",
      },
      {
        ...mumbaiGame,
        functionName: "interval",
      },
      {
        ...mumbaiGame,
        functionName: "gameStarted",
      },
    ],
  });

  const [hasJoinedGame, setHasJoinedGame] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<BigNumber>(BigNumber.from(0));
  const [spoils, setSpoils] = useState<BigNumber>(BigNumber.from(0));
  const [gameStartTimestamp, setGameStartTimestamp] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [numberOfActivePlayers, setNumberOfActivePlayers] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (data) {
      const [
        currentTurn,
        spoils,
        gameStartTimestamp,
        activePlayersCount,
        interval,
        _gameStarted,
      ] = data;

      if (currentTurn && BigNumber.from(currentTurn).gt(0)) {
        setCurrentTurn(BigNumber.from(currentTurn));
      }

      if (activePlayersCount && BigNumber.from(activePlayersCount).gt(0)) {
        setNumberOfActivePlayers(BigNumber.from(activePlayersCount));
      }

      if (spoils && BigNumber.from(spoils).gt(0)) {
        setHasJoinedGame(true);
        setSpoils(BigNumber.from(spoils));
      }

      if (gameStartTimestamp && BigNumber.from(gameStartTimestamp).gt(0)) {
        setGameStartTimestamp(BigNumber.from(gameStartTimestamp));
      }
      console.log("gameStarted", _gameStarted);
      console.log("Current turn", currentTurn);
      console.log("Game start timestamp", gameStartTimestamp);
      setGameStarted(_gameStarted as unknown as boolean);
    }
  }, [data]);

  return (
    <div>
      <Head>
        <title>Domination</title>
        <meta
          name="description"
          content="Simple, on-chain, winner takes all board game."
        />
      </Head>
      {isSuccess && (
        <Header
          currentTurn={currentTurn}
          gameStarted={gameStarted}
          gameStartTimestamp={gameStartTimestamp}
          numberOfActivePlayers={numberOfActivePlayers}
          spoils={spoils}
        />
      )}

      <section className="container pt-12 h-screen w-screen mx-auto my-0 flex items-center justify-center">
        {hasJoinedGame ? (
          currentTurn?.gt(0) ? (
            <Board currentTurn={currentTurn} />
          ) : (
            <div className="h-60 w-25 rounded-md bg-white pt-14 p-20 flex-col justify-center align-center text-center">
              <p className="text-stone-500 text-center font-bold m-auto text-2xl">
                You&apos;re all set!
              </p>
              <p className="text-stone-500 text-center m-auto text-md py-5">
                Come back{" "}
                {gameStartTimestamp && formatGameStartTime(gameStartTimestamp)}{" "}
                to make your first move.
              </p>
              <a
                href="https://github.com/pmespresso/dom-strategy-game#readme"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
              >
                Game Rules
              </a>
            </div>
          )
        ) : (
          <Connect />
        )}
      </section>
    </div>
  );
};

export default Index;
