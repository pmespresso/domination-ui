import React from "react";
import Link from "next/link";
import { InjectedConnector } from "@wagmi/core";
import { useAccount, useConnect } from "wagmi";
import { BigNumber } from "ethers";

import { formatUnits } from "ethers/lib/utils";

interface Props {
  currentTurn?: BigNumber;
  gameStartRemainingTime?: BigNumber;
  spoils?: BigNumber;
}

export default function Header(props: Props) {
  const { gameStartRemainingTime, spoils, currentTurn } = props;
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  console.log("gameStartRemainingTime: ", gameStartRemainingTime);

  return (
    <header className="py-10 fixed top-0 left-0">
      <nav className="relative px-10  z-50 flex justify-between w-screen">
        <div className="flex">
          <Link href="#" aria-label="Home">
            <p className="font-sans font-bold text-white text-2xl hover:cursor-pointer mr-4">
              Domination
            </p>
          </Link>
          <p className="text-stone-600 font-semibold mt-1 mr-4">
            {currentTurn && currentTurn.eq(0)
              ? `Game Starting In: ${BigNumber.from(gameStartRemainingTime)
                  .div(60)
                  .toString()} hours!`
              : "Current Turn: " + currentTurn}
          </p>
        </div>

        {isConnected ? (
          <div className="flex items-end">
            {spoils && (
              <p className="text-stone-600 font-semibold mr-4">
                Your Starting Spoils: {formatUnits(spoils, "ether")} Ether
              </p>
            )}

            <p className="text-stone-600 font-bold">
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
