import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import { InjectedConnector } from "@wagmi/core";
import {
  useAccount,
  useConnect,
  useContract,
  useContractRead,
  useEnsName,
} from "wagmi";

import DomStrategyGame from "../abis/DomStrategyGame.json";
import { formatUnits, parseUnits, Result } from "ethers/lib/utils";
import { BigNumber, BigNumberish } from "ethers";
import { GameMumbaiAddress } from "@/constants";

function MobileNavLink({ href, children }: any) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({ open }: any) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0"
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
}

export default function Header() {
  const { address, isConnected } = useAccount();
  // const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data } = useContractRead({
    addressOrName: GameMumbaiAddress,
    contractInterface: DomStrategyGame.abi,
    functionName: "currentTurn",
  });

  return (
    <header className="py-10 fixed top-0 left-0">
      <nav className="relative px-10  z-50 flex justify-between w-screen">
        <Link href="#" aria-label="Home">
          <p className="font-sans font-bold text-white text-2xl">Domination</p>
        </Link>

        {isConnected ? (
          <div className="flex items-start">
            <p className="text-white mr-4">
              {data && BigNumber.from(data).eq(0)
                ? "Game Starting Soon!"
                : "Current Turn: " + data}
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
