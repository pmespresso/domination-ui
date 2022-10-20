import { contractReadsMumbaiGame, contracts } from "@/constants";
import { GameStateContext } from "@/GameStateContext";
import { BigNumber, utils } from "ethers";
import React, { useCallback, useContext, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";

interface AllianceStruct {
  admin: string;
  id: BigNumber;
  membersCount: BigNumber;
  maxMembers: BigNumber;
  totalBalance: BigNumber;
  name: string;
}

export function Alliances() {
  const { currentTurn, IDomGame, nonce, nextAvailableAllianceId } =
    useContext(GameStateContext);
  const { address: playerAddr } = useAccount();
  const { data: signer } = useSigner();
  const [commitment, setCommitment] = useState<string>();

  const { data: alliances, isSuccess } = useContractReads({
    contracts: new Array(nextAvailableAllianceId).map((v, i) => ({
      ...contractReadsMumbaiGame,
      functionName: "alliances",
      args: [i + 1],
    })),
  });

  const { config: joinAllianceConfig } = usePrepareContractWrite({
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: contracts.mumbai.abis.game,
    functionName: "submit",
    args: [currentTurn.toNumber(), commitment],
    overrides: {
      gasLimit: 500000,
    },
  });

  const applyToJoinAlliance = useCallback(
    async (selectedAllianceId: BigNumber) => {
      if (IDomGame && nonce && signer) {
        const application = utils.solidityPack(
          ["uint256", "uint256"],
          [currentTurn.toNumber(), selectedAllianceId]
        );

        const hash = utils.keccak256(application);

        const signature = await signer.signMessage(hash);

        const splitSignature = utils.splitSignature(signature);

        // const call = utils.encodeWithSelector(DomStrategyGame.joinAlliance.selector, piskomate, allianceId, v, r, s);

        const call = IDomGame.encodeFunctionData("joinAlliance", [
          playerAddr,
          selectedAllianceId,
          splitSignature.v,
          splitSignature.r,
          splitSignature.s,
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
    },
    [currentTurn, IDomGame, nonce, signer, playerAddr]
  );

  console.log("alliances => ", alliances);

  return (
    <div className="grid gap-10 grid-cols-5 grid-rows-3">
      {alliances?.map((alliance) => {
        return <p key={alliance.id}>{alliance.name}</p>;
      })}
    </div>
  );
}
