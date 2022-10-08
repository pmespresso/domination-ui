import {
  BaseCharacterIpfsImage,
  BaseCharacterMumbaiAddress,
  GameMumbaiAddress,
} from "@/constants";
import { Tab } from "@headlessui/react";
import React, { Fragment, useCallback, useState } from "react";
import {
  erc721ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { BigNumber, Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";

import DomStrategyGame from "../abis/DomStrategyGame.json";
import BaseCharacter from "../abis/BaseCharacter.json";
import { PrimaryButton } from "./Button";
import Loading from "./Loading";
import Image from "next/image";

const BaseCharacterTypes = ["bfg", "dragon", "knight", "robot", "wizard"];

function MintBaseCharacter({ to }: { to: string }) {
  const { address, isConnected } = useAccount();

  const { config } = usePrepareContractWrite({
    addressOrName: BaseCharacterMumbaiAddress,
    contractInterface: BaseCharacter.abi,
    functionName: "mint",
    args: [to],
  });
  const { write: mint, isLoading, isSuccess } = useContractWrite(config);

  const { data: baseCharacterBalance } = useContractRead({
    addressOrName: BaseCharacterMumbaiAddress,
    contractInterface: BaseCharacter.abi,
    functionName: "balanceOf",
    args: [address],
  });

  const handleMint = () => {
    if (mint) {
      mint();
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : isSuccess ? (
        <p>Success</p>
      ) : (
        <PrimaryButton label="Mint" onClick={handleMint} />
      )}
    </div>
  );
}

export default function Connect() {
  const { address: signerAddress } = useAccount();
  const { data: signer } = useSigner();
  const [byoNft, setByoNftAddress] = useState("");
  const [byoNftTokenId, setTokenId] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const [desiredStartingSpoils, setDesiredStartingSpoils] = useState<number>(0);

  const { data: baseCharacterBalance } = useContractRead({
    addressOrName: BaseCharacterMumbaiAddress,
    contractInterface: BaseCharacter.abi,
    functionName: "balanceOf",
    args: [signerAddress],
  });
  const { data: ownedBy } = useContractRead({
    addressOrName: BaseCharacterMumbaiAddress,
    contractInterface: BaseCharacter.abi,
    functionName: "tokensOwnedBy",
    args: [signerAddress, 0],
  });

  const { config } = usePrepareContractWrite({
    addressOrName: GameMumbaiAddress,
    contractInterface: DomStrategyGame.abi,
    functionName: "connect",
    args: [byoNft, byoNftTokenId],
    overrides: {
      value: parseEther(String(desiredStartingSpoils)),
    },
  });
  const { write: joinGame, isLoading, isSuccess } = useContractWrite(config);

  const validateBalance = useCallback(async () => {
    if (signer) {
      const contract = new Contract(byoNft, erc721ABI, signer);

      const balance = await contract.balanceOf(
        await signer.getAddress(),
        byoNftTokenId
      );

      console.log("Balance, ", balance);

      if (BigNumber.from(balance).eq(0)) {
        setError("You don't own this NFT.");
      }
    }
  }, [byoNft, byoNftTokenId, signer]);

  const handleInputBYONFT = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      console.log(value);
      if (byoNft.length > 42) {
        setError("Address is too long!");
        return;
      } else if (byoNft.length == 42 && !!byoNftTokenId) {
        validateBalance();
        return;
      }

      setByoNftAddress(value);
    },
    [byoNft.length, validateBalance, byoNftTokenId]
  );

  const handleJoinGame = useCallback(async () => {
    console.log("here: ", joinGame);
    if (!isLoading && joinGame) {
      await joinGame();
    }
  }, [joinGame, isLoading]);

  const handleJoinWithDominationCharacter = useCallback(async () => {
    console.log("Owned By: ", ownedBy);
    console.log("Balnace of : ", baseCharacterBalance);
    if (ownedBy) {
      setByoNftAddress(BaseCharacterMumbaiAddress);
      setTokenId(BigNumber.from(ownedBy).toNumber());
    }
  }, [ownedBy, baseCharacterBalance]);

  return (
    <div className="flex-col items-center justify-center mw-96">
      <Tab.Group>
        <Tab.List className="flex bg-white rounded-md text-stone-800 mb-6 border-slate-800">
          <Tab as={Fragment}>
            {({ selected }) => (
              <p
                className={`${
                  selected && "text-blue-500 font-semibold"
                } + px-4 py-8 hover:cursor-pointer`}
              >
                Connect with your NFT
              </p>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <p
                className={`${
                  selected && "text-blue-500 font-semibold"
                } + px-4 py-8 hover:cursor-pointer`}
              >
                Connect with your Domination Character
              </p>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <p
                className={`${
                  selected && "text-blue-500 font-semibold"
                } + px-4 py-8 hover:cursor-pointer`}
              >
                Mint Domination Character
              </p>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className="bg-white rounded-md text-stone-800">
          <Tab.Panel>
            <input
              className="w-full p-4 my-4"
              type="text"
              placeholder="Your NFT address e.g. 0xff92920109...."
              onChange={handleInputBYONFT}
            />
            <input
              className="w-full p-4 my-4"
              type="number"
              placeholder="Your NFT Token ID e.g. 9669"
              onChange={({ target: { value } }) => setTokenId(Number(value))}
            />
            <PrimaryButton
              disabled={!!error}
              label="Connect"
              onClick={handleJoinGame}
            />
          </Tab.Panel>
          <Tab.Panel>
            {baseCharacterBalance &&
              BigNumber.from(baseCharacterBalance).gt(0) && (
                <div className="flex-col">
                  {byoNftTokenId && (
                    <div>
                      <p className="text-lg font-semibold">
                        We found a Domination Character for you!
                      </p>
                      <Image
                        width={500}
                        height={500}
                        alt="base character image"
                        src={`${BaseCharacterIpfsImage}/${
                          BaseCharacterTypes[byoNftTokenId % 5]
                        }.jpg`}
                      />
                    </div>
                  )}

                  <PrimaryButton
                    onClick={handleJoinWithDominationCharacter}
                    label="Connect with your Domination Character"
                  />
                </div>
              )}
          </Tab.Panel>
          <Tab.Panel>
            {signerAddress && <MintBaseCharacter to={signerAddress} />}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
