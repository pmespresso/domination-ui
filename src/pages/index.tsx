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
import Link from "next/link";

const Index: NextPage = () => {
  const { address } = useAccount();

  const mumbaiGame = {
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: contracts.mumbai.abis.game,
    watch: true,
  };

  const { data } = useContractReads({
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
        addressOrName: contracts.mumbai.keeperAddress,
        contractInterface: contracts.mumbai.abis.keeper,
        functionName: "gameStartRemainingTime",
        watch: true,
      },
    ],
  });

  const [hasJoinedGame, setHasJoinedGame] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<BigNumber>();
  const [spoils, setSpoils] = useState<BigNumber>();
  const [timeTillStart, setTimeTillStart] = useState<BigNumber>();

  useEffect(() => {
    const currentTurn = data && data[0];
    const spoils = data && data[1];
    const gameStartRemainingTime = data && data[2];

    if (currentTurn && BigNumber.from(currentTurn).gt(0)) {
      setCurrentTurn(BigNumber.from(currentTurn));
    }

    if (spoils && BigNumber.from(spoils).gt(0)) {
      setHasJoinedGame(true);
      setSpoils(BigNumber.from(spoils));
    }

    if (
      gameStartRemainingTime &&
      BigNumber.from(gameStartRemainingTime).gt(0)
    ) {
      setTimeTillStart(BigNumber.from(gameStartRemainingTime));
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
      <Header
        currentTurn={currentTurn}
        gameStartRemainingTime={timeTillStart}
        spoils={spoils}
      />
      <section className="container pt-12 h-screen w-screen mx-auto my-0 flex items-center justify-center">
        {hasJoinedGame ? (
          currentTurn?.gt(0) ? (
            <Board />
          ) : (
            <div className="h-60 w-25 rounded-md bg-white pt-14 p-20 flex-col justify-center align-center text-center">
              <p className="text-stone-500 text-center font-bold m-auto text-2xl">
                You&apos;re all set!
              </p>
              <p className="text-stone-500 text-center m-auto text-md py-5">
                Come back in {timeTillStart?.div(60).toString()} hours to make
                your first move.
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
