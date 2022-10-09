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
import { useAccount, useContractRead } from "wagmi";

const Index: NextPage = () => {
  const { address } = useAccount();
  const { data: currentTurn } = useContractRead({
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: contracts.mumbai.abis.game,
    functionName: "currentTurn",
    watch: true,
  });
  const { data: spoils } = useContractRead({
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: contracts.mumbai.abis.game,
    functionName: "spoils",
    args: [address],
    watch: true,
  });
  const { data: gameStartRemainingTime } = useContractRead({
    addressOrName: contracts.mumbai.keeperAddress,
    contractInterface: contracts.mumbai.abis.keeper,
    functionName: "gameStartRemainingTime",
  });

  const [hasJoinedGame, setHasJoinedGame] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [timeTillStart, setTimeTillStart] = useState("");

  useEffect(() => {
    if (currentTurn && BigNumber.from(currentTurn).gt(0)) {
      setHasGameStarted(true);
    }

    if (spoils && BigNumber.from(spoils).gt(0)) {
      setHasJoinedGame(true);
    }

    if (
      gameStartRemainingTime &&
      BigNumber.from(gameStartRemainingTime).gt(0)
    ) {
      setTimeTillStart(
        BigNumber.from(gameStartRemainingTime).div(60).toString()
      );
    }
  }, [gameStartRemainingTime, spoils, currentTurn]);

  return (
    <div>
      <Head>
        <title>Domination</title>
        <meta
          name="description"
          content="Simple, on-chain winner takes all board game."
        />
      </Head>
      <Header
        currentTurn={currentTurn && BigNumber.from(currentTurn)}
        gameStartRemainingTime={
          gameStartRemainingTime && BigNumber.from(gameStartRemainingTime)
        }
        spoils={spoils && BigNumber.from(spoils)}
      />
      <section className="container pt-12 h-screen w-screen mx-auto my-0 flex items-center justify-center">
        {hasJoinedGame ? (
          hasGameStarted ? (
            <Board />
          ) : (
            <div className="h-60 w-25 rounded-md bg-white p-20">
              <p className="text-stone-500 text-center font-bold m-auto justify-center text-2xl">
                You&apos;re all set!
              </p>
              <p className="text-stone-500 text-center m-auto justify-center text-md">
                Come back in {timeTillStart} hours to make your first move.
              </p>
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
