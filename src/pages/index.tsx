import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";

// https://jonmeyers.io/blog/fix-client-server-hydration-error-in-next-js
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
import Board from "@/components/Board";
const Connect = dynamic(() => import("@/components/Connect"), { ssr: false });
import { BigNumber } from "ethers";
import { formatGameStartTime } from "@/utils";
import { GameStateContext, GameStateContextProvider } from "@/GameStateContext";
import { AllianceOverviewBadge, Alliances } from "@/components/Alliances";

const Index: NextPage = () => {
  const {
    currentTurn,
    gameStarted,
    gameStartTimestamp,
    numberOfActivePlayers,
    hasJoinedGame,
    interval,
    spoils,
  } = useContext(GameStateContext);

  const [selectedIndex, setSelectedIndex] = useState(0);

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
        gameStarted={gameStarted}
        gameStartTimestamp={gameStartTimestamp}
        numberOfActivePlayers={numberOfActivePlayers}
        spoils={spoils}
      />

      <section className="container pt-12 w-3/4 mx-auto my-24 flex-col items-center justify-center">
        {hasJoinedGame ? (
          currentTurn?.gt(0) ? (
            <Tab.Group
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            >
              <Tab.List className="flex bg-white rounded-md text-stone-800 mb-6 border-slate-800">
                <Tab as={React.Fragment}>
                  {({ selected }) => (
                    <p
                      className={`${
                        selected && "text-blue-500 font-semibold"
                      } + px-4 py-8 hover:cursor-pointer`}
                    >
                      Game Board
                    </p>
                  )}
                </Tab>
                <Tab as={React.Fragment}>
                  {({ selected }) => (
                    <p
                      className={`${
                        selected && "text-blue-500 font-semibold"
                      } + px-4 py-8 hover:cursor-pointer`}
                    >
                      Alliance Overview
                    </p>
                  )}
                </Tab>
              </Tab.List>
              <Tab.Panels className="bg-white rounded-md text-stone-800">
                <Tab.Panel>
                  <Board currentTurn={currentTurn} />
                </Tab.Panel>
                <Tab.Panel>
                  <Alliances />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
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
