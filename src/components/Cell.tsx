import React, { useEffect, useCallback, useState } from "react";
import { BigNumber, utils } from "ethers";
import { Interface } from "ethers/lib/utils";

export default function Cell({
  currentTurn,
  moveDirection,
  isRestingSquare,
  player,
  IDomGame,
  nonce,
  handleCommitment,
}: {
  currentTurn: BigNumber;
  moveDirection: number | null;
  isRestingSquare?: boolean;
  player: string;
  IDomGame: Interface;
  nonce: number;
  handleCommitment: (data: string, moveDirection: number | null) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (IDomGame && nonce) {
      if (isRestingSquare) {
        // rest
        const call = IDomGame.encodeFunctionData("rest", [player]);

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
          player,
          moveDirection,
        ]);

        handleCommitment(data, moveDirection);
      }
    }
  }, [
    IDomGame,
    player,
    isRestingSquare,
    moveDirection,
    nonce,
    handleCommitment,
  ]);

  const handleMouseEnter = useCallback(() => {
    if (moveDirection) {
      console.log("MOVE DIRECITON => ", moveDirection);

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
