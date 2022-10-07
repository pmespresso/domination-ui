import { BaseCharacterMumbaiAddress, GameMumbaiAddress } from "@/constants";
import React, { useCallback, useState } from "react";
import {
  erc721ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { BigNumber, Contract } from "ethers";
import DomStrategyGame from "../abis/DomStrategyGame.json";
import BaseCharacter from "../abis/BaseCharacter.json";
import Loading from "./Loading";

function MintBaseCharacter({ to, tokenId }: { to: string; tokenId: number }) {
  const { config } = usePrepareContractWrite({
    addressOrName: BaseCharacterMumbaiAddress,
    contractInterface: BaseCharacter.abi,
    functionName: "mint",
    args: [to, tokenId],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleMint = useCallback(async () => {
    if (!isLoading && write) {
      await write();
    }
  }, [isLoading, write]);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : isSuccess ? (
        <div>Success</div>
      ) : (
        <p className="text-stone-800 font-bold" onClick={handleMint}>
          (or mint one of ours 😉)
        </p>
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

  const { config } = usePrepareContractWrite({
    addressOrName: GameMumbaiAddress,
    contractInterface: DomStrategyGame.abi,
    functionName: "connect",
    args: [signerAddress, byoNft],
  });
  const {
    data,
    isLoading,
    isSuccess,
    write: connect,
  } = useContractWrite(config);

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
    if (connect && !isLoading) {
      await connect();
    }
  }, [connect, isLoading]);

  return (
    <div className="flex-col items-center justify-center w-96">
      <div className="flex">
        <p className="text-stone-800 font-semibold">Connect with your NFT </p>
        {signerAddress && <MintBaseCharacter to={signerAddress} tokenId={2} />}
      </div>
      <input
        className="w-full p-4 my-4"
        type="text"
        placeholder="e.g. 0xff92920109...."
        onChange={handleInputBYONFT}
      />
      <input
        className="w-full p-4 my-4"
        type="number"
        placeholder="e.g. 9669"
        onChange={({ target: { value } }) => setTokenId(Number(value))}
      />
      {isLoading ? (
        <Loading />
      ) : isSuccess ? (
        <div>Success</div>
      ) : (
        <button
          className="mx-auto w-full h-12 rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500"
          disabled={!!error}
          onClick={handleJoinGame}
        >
          Connect
        </button>
      )}
    </div>
  );
}
