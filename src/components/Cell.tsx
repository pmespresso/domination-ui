import React, { useEffect, useCallback, useState } from "react";
import { BigNumber, utils } from "ethers";
import { Interface } from "ethers/lib/utils";
import Image from "next/image";
import { contracts } from "@/constants";
import { BaseCharacterTypes } from "./Connect";

export default function Cell({
  moveDirection,
  isRestingSquare,
  playerAddr,
  playerTokenId,
  IDomGame,
  nonce,
  handleCommitment,
}: {
  moveDirection: number | null;
  isRestingSquare?: boolean;
  playerAddr: string;
  playerTokenId: number;
  IDomGame: Interface;
  nonce: number;
  handleCommitment: (data: string, moveDirection: number | null) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (IDomGame && nonce) {
      if (isRestingSquare) {
        // rest
        const call = IDomGame.encodeFunctionData("rest", [playerAddr]);

        const data = utils.keccak256(
          utils.solidityPack(
            ["bytes32", "bytes"],
            [utils.hexZeroPad(utils.hexlify(nonce), 32), call]
          )
        );

        handleCommitment(data, moveDirection);
      } else {
        // move
        const data = IDomGame.encodeFunctionData("move", [
          playerAddr,
          moveDirection,
        ]);

        handleCommitment(data, moveDirection);
      }
    }
  }, [
    IDomGame,
    playerAddr,
    isRestingSquare,
    moveDirection,
    nonce,
    handleCommitment,
  ]);

  const handleMouseEnter = useCallback(() => {
    if (moveDirection) {
      setIsHovered(true);
    } else {
      if (isRestingSquare) {
        setIsHovered(true);
      }
    }
  }, [moveDirection, isRestingSquare]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-white border-black h-52 w-72 ${
        isHovered &&
        (moveDirection || isRestingSquare) &&
        "hover:bg-stone-800 hover:cursor-pointer"
      }  flex flex-col align-middle justify-center`}
    >
      {moveDirection == 0 ? (
        <Image
          loading="lazy"
          width={300}
          height={300}
          alt="base character image"
          src={`${contracts.mumbai.baseCharacterIpfsUrl}/${
            BaseCharacterTypes[playerTokenId % 5]
          }.jpg`}
          className="justify-center mx-auto"
        />
      ) : (
        <h1 className="justify-center mx-auto text-8xl">?</h1>
      )}

      {isHovered ? (
        isRestingSquare ? (
          <p className="text-white text-2xl mx-auto">Rest</p>
        ) : (
          <p className="text-white text-2xl mx-auto">Move</p>
        )
      ) : null}
    </div>
  );
}
