import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { InjectedConnector } from "@wagmi/core";
import {
  useAccount,
  useConnect,
  useContract,
  useContractRead,
  useEnsName,
} from "wagmi";

import { BaseCharacterMumbaiAddress, GameMumbaiAddress } from "@/constants";
import { BigNumber } from "ethers";

import DomStrategyGame from "../abis/DomStrategyGame.json";

export default function Header() {
  const { address, isConnected } = useAccount();
  // const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data: currentTurn } = useContractRead({
    addressOrName: GameMumbaiAddress,
    contractInterface: DomStrategyGame.abi,
    functionName: "currentTurn",
  });
  const { data: spoils } = useContractRead({
    addressOrName: GameMumbaiAddress,
    contractInterface: DomStrategyGame.abi,
    functionName: "spoils",
    args: [address],
  });

  return (
    <header className="py-10 fixed top-0 left-0">
      <nav className="relative px-10  z-50 flex justify-between w-screen">
        <Link href="#" aria-label="Home">
          <p className="font-sans font-bold text-white text-2xl">Domination</p>
        </Link>

        {BigNumber.from(spoils).gt(0) && (
          <p className="text-stone-200 font-semibold">
            Your Spoils: {spoils && BigNumber.from(spoils).toString()}
          </p>
        )}
        {isConnected ? (
          <div className="flex items-start">
            <p className="text-white mr-4">
              {currentTurn && BigNumber.from(currentTurn).eq(0)
                ? "Game Starting Soon!"
                : "Current Turn: " + currentTurn}
            </p>
            <p className="text-white font-bold">
              Connected to{" "}
              {address
                ?.slice(0, 8)
                .concat("...")
                .concat(address.slice(address.length - 10))}
            </p>
          </div>
        ) : (
          <button
            type="button"
            className="rounded-full bg-gradient-to-br from-slate-200 to-slate-800 hover:lg-full w-32 h-12 text-white font-bold mt-3"
            onClick={() => connect()}
          >
            Connect
          </button>
        )}
      </nav>
    </header>
  );
}
