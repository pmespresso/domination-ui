import { contracts } from "@/constants";
import { Tab } from "@headlessui/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
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

const BaseCharacterTypes = ["bfg", "dragon", "knight", "robot", "wizard"];

function MintBaseCharacter() {
  const { address, isConnected } = useAccount();

  const { config } = usePrepareContractWrite({
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: BaseCharacter.abi,
    functionName: "mint",
    args: [address],
  });
  const { write: mint, isLoading, isSuccess } = useContractWrite(config);

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
        <PrimaryButton
          label="Mint"
          onClick={handleMint}
          disabled={!isConnected}
        />
      )}
    </div>
  );
}

interface ConnectButtonProps {
  byoNft: string;
  byoNftTokenId?: number;
  desiredStartingSpoils: number;
  error: string | null;
  label: string;
}

function ConnectButton({
  byoNft,
  byoNftTokenId,
  desiredStartingSpoils,
  error,
  label,
}: ConnectButtonProps) {
  const { config } = usePrepareContractWrite({
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: DomStrategyGame.abi,
    functionName: "connect",
    args: [byoNftTokenId, byoNft],
    overrides: {
      value: parseEther(String(desiredStartingSpoils)),
      gasLimit: 1000000,
    },
  });
  const { write, isLoading, isSuccess } = useContractWrite(config);

  const handleJoinGame = useCallback(async () => {
    console.log("here: ", write);
    if (!isLoading && write) {
      await write();
    }
  }, [write, isLoading]);

  return (
    <PrimaryButton disabled={!!error} label={label} onClick={handleJoinGame} />
  );
}

export default function Connect() {
  const { address: signerAddress } = useAccount();
  const { data: signer } = useSigner();
  const [byoNft, setByoNftAddress] = useState("");
  const [byoNftTokenId, setTokenId] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const [desiredStartingSpoils, setDesiredStartingSpoils] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: baseCharacterBalance } = useContractRead({
    addressOrName: contracts.mumbai.baseCharacterNftAddress,
    contractInterface: BaseCharacter.abi,
    functionName: "balanceOf",
    args: [signerAddress],
  });
  const { data: ownedBy } = useContractRead({
    addressOrName: contracts.mumbai.baseCharacterNftAddress,
    contractInterface: BaseCharacter.abi,
    functionName: "tokensOwnedBy",
    args: [signerAddress, 0],
  });

  useEffect(() => {
    if (selectedIndex == 1) {
      console.log("Owned By: ", ownedBy);
      console.log("Balnace of : ", baseCharacterBalance);
      if (ownedBy) {
        setByoNftAddress(contracts.mumbai.baseCharacterNftAddress);
        setTokenId(BigNumber.from(ownedBy).toNumber());
      }
    }
  }, [selectedIndex, ownedBy, baseCharacterBalance]);

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

  return (
    <div className="flex-col items-center justify-center mw-96">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
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
            <ConnectButton
              desiredStartingSpoils={desiredStartingSpoils}
              byoNft={byoNft}
              byoNftTokenId={byoNftTokenId}
              error={error}
              label="Connect with your NFT"
            />
          </Tab.Panel>
          <Tab.Panel>
            {baseCharacterBalance &&
              BigNumber.from(baseCharacterBalance).gt(0) && (
                <div className="flex-col">
                  {byoNftTokenId && (
                    <div className="flex-col">
                      <p className="text-lg font-light text-center">
                        Connect with your Domination Character NFT
                      </p>
                      <Image
                        loading="lazy"
                        width={300}
                        height={300}
                        alt="base character image"
                        src={`${contracts.mumbai.baseCharacterIpfsUrl}/${
                          BaseCharacterTypes[byoNftTokenId % 5]
                        }.jpg`}
                        className="justify-center mx-auto"
                      />
                      <input
                        className="w-full p-4 my-4"
                        type="number"
                        placeholder="Desired Starting Spoils in Ether (the more you pay, the more you get if you join an alliance) - e.g. 0.01"
                        onChange={({ target: { value } }) =>
                          setDesiredStartingSpoils(Number(value))
                        }
                      />
                    </div>
                  )}

                  <ConnectButton
                    error={error}
                    desiredStartingSpoils={desiredStartingSpoils}
                    byoNft={byoNft}
                    byoNftTokenId={byoNftTokenId}
                    label="Connect with your Domination Character"
                  />
                </div>
              )}
          </Tab.Panel>
          <Tab.Panel>
            <MintBaseCharacter />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
