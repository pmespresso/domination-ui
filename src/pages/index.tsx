import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";

// https://jonmeyers.io/blog/fix-client-server-hydration-error-in-next-js
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
import Board from "@/components/Board";
const Connect = dynamic(() => import("@/components/Connect"), { ssr: false });
import { formatGameStartTime } from "@/utils";
import { GameStateContext } from "@/GameStateContext";
import { Alliances } from "@/components/Alliances";
import { PrimaryButton } from "@/components/Button";
import { utils } from "ethers";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { contracts } from "@/constants";

const Index: NextPage = () => {
  const {
    currentTurn,
    gameStarted,
    gameStartTimestamp,
    numberOfActivePlayers,
    hasJoinedGame,
    IDomGame,
    nonce,
    spoils,
  } = useContext(GameStateContext);
  const { address: playerAddr } = useAccount();
  const { data: signer } = useSigner();
  const [allianceName, setAllianceName] = useState("");
  const [maxMembers, setMaxMembers] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [commitment, setCommitment] = useState<string>();

  const { config: submitConfig } = usePrepareContractWrite({
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: contracts.mumbai.abis.game,
    functionName: "submit",
    args: [currentTurn.toNumber(), commitment],
    overrides: {
      gasLimit: 1000000,
    },
  });

  const { write } = useContractWrite(submitConfig);

  const handleCreateAlliance = useCallback(async () => {
    if (IDomGame && nonce && signer) {
      const call = IDomGame.encodeFunctionData("createAlliance", [
        playerAddr,
        maxMembers,
        allianceName,
      ]);

      const encodedCall = utils.keccak256(
        utils.solidityPack(
          ["uint256", "bytes32", "bytes"],
          [
            currentTurn.toNumber(),
            utils.hexZeroPad(utils.hexlify(nonce), 32),
            call,
          ]
        )
      );

      setCommitment(encodedCall);
    }
  }, [
    IDomGame,
    nonce,
    signer,
    playerAddr,
    currentTurn,
    allianceName,
    maxMembers,
  ]);

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
              <Tab.List className="flex bg-white rounded-md text-stone-800 mb-6 border-slate-800 px-6">
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
                <Tab as={React.Fragment}>
                  {({ selected }) => (
                    <div className="ml-auto my-auto w-40">
                      <p
                        className={`${
                          selected && "text-blue-500 font-semibold"
                        } + px-4 py-8 hover:cursor-pointer`}
                      >
                        Create Alliance
                      </p>
                    </div>
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
                <Tab.Panel>
                  <div className="flex flex-col items-center justify-center py-32">
                    <p className="text-2xl font-sans pt-4">
                      Create New Alliance
                    </p>
                    {commitment ? (
                      <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-lg font-semibold">
                          This will count as your move for this turn.
                        </p>
                        <p className="text-center">Commitment: {commitment}</p>
                        <button
                          className="text-lg mt-6 py-2 px-4 border border-slate-400 rounded-md"
                          onClick={() => write?.()}
                        >
                          Continue?
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          className="w-96 my-4 p-8 border border-slate-800 rounded-md"
                          type="text"
                          onChange={({ target: { value } }) =>
                            setAllianceName(value)
                          }
                          value={allianceName}
                          placeholder="Alliance Name"
                        />
                        <input
                          className="w-96 my-4 p-8 border border-slate-800 rounded-md"
                          type="number"
                          onChange={({ target: { value } }) =>
                            setMaxMembers(Number(value))
                          }
                          value={maxMembers}
                          placeholder="Max Members"
                        />
                        <div className="w-40">
                          <PrimaryButton
                            label="Create Alliance"
                            onClick={handleCreateAlliance}
                          />
                        </div>
                      </div>
                    )}
                  </div>
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
