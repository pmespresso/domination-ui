import { Dialog } from "@headlessui/react";
import { BigNumber, utils } from "ethers";
import { Interface } from "ethers/lib/utils";
import React, { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";

import { contracts } from "../constants";
import { PrimaryButton } from "./Button";
import Cell from "./Cell";

interface DialogProps {
  isOpen: boolean;
  handleClose: () => void;
  submit: any;
  selectedMoveDirection?: string;
}

function ConfirmationDialog(props: DialogProps) {
  const { isOpen, handleClose, submit, selectedMoveDirection } = props;

  const handleSubmission = useCallback(async () => {
    console.log("here");
    await submit();

    handleClose();
  }, [handleClose, submit]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="absolute left-0 right-0 mx-auto h-72 w-96 bg-white rounded-lg p-4"
    >
      <Dialog.Panel>
        <Dialog.Title className="text-2xl">Confirm Move</Dialog.Title>
        <Dialog.Description className="py-4">
          You can only submit your move once, this cannot be changed.
        </Dialog.Description>

        <p>Are you sure you want to {selectedMoveDirection}?</p>

        <div className="flex align-baseline justify-between pt-8">
          <button className="w-2/3 hover:cursor-pointer" onClick={handleClose}>
            Cancel
          </button>
          <PrimaryButton onClick={handleSubmission} label="Submit" />
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

interface Props {
  currentTurn: BigNumber;
}

enum GameStage {
  Submit,
  Reveal,
  Resolve,
}

export default function Board(props: Props) {
  // TODO: get this from Context
  const { currentTurn } = props;
  const { address: playerAddress } = useAccount();
  const { data: player } = useContractRead({
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: contracts.mumbai.abis.game,
    watch: true,
    functionName: "players",
    args: [playerAddress],
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [gameStage, setGameStage] = useState<GameStage>(GameStage.Submit);
  const { data: signer } = useSigner();

  const [commitment, setCommitment] = useState<string>();
  const [IDomGame, setInterface] = useState<Interface>();
  const [nonce, setNonce] = useState<number>();
  const [selectedMoveDirection, setSelectedMoveDirection] = useState<string>();

  const { config: submitConfig } = usePrepareContractWrite({
    addressOrName: contracts.mumbai.gameAddress,
    contractInterface: contracts.mumbai.abis.game,
    functionName: "submit",
    args: [currentTurn.toNumber(), commitment],
    overrides: {
      gasLimit: 1000000,
    },
  });

  const { write: submitMove } = useContractWrite(submitConfig);

  useEffect(() => {
    setInterface(new utils.Interface(contracts.mumbai.abis.game));
  }, []);

  useEffect(() => {
    async function getNonce() {
      if (signer) {
        const _nonce = await signer.getTransactionCount();
        setNonce(_nonce);
      }
    }

    getNonce();
  }, [signer]);

  useEffect(() => {
    if (player?.pendingMoveCommitment) {
      setHasSubmitted(true);
    } else {
      setHasSubmitted(false);
    }

    if (player?.pendingMove) {
      setHasRevealed(true);
    } else {
      setHasRevealed(false);
    }
  }, [player]);

  const handleCommitment = useCallback(
    (data: string, moveDirection: number | null) => {
      switch (moveDirection) {
        case 0:
          setSelectedMoveDirection("Rest");
          break;
        case -1:
          setSelectedMoveDirection("Move Up");
          break;
        case 1:
          setSelectedMoveDirection("Move Down");
          break;
        case -2:
          setSelectedMoveDirection("Move Left");
          break;
        case 2:
          setSelectedMoveDirection("Move Right");
          break;
        default:
          break;
      }

      setCommitment(data);
      setShowConfirmation(true);
    },
    []
  );

  const moveDirections = [null, -1, null, -2, 0, 2, null, 1, null];

  return (
    <div>
      {showConfirmation ? (
        <ConfirmationDialog
          isOpen={showConfirmation}
          handleClose={() => setShowConfirmation(false)}
          submit={submitMove}
          selectedMoveDirection={selectedMoveDirection}
        />
      ) : player && nonce && IDomGame && gameStage === GameStage.Submit ? (
        <div className="grid gap-10 grid-cols-3 grid-rows-3">
          {moveDirections.map((dir, i) => {
            return (
              <Cell
                key={i}
                currentTurn={currentTurn}
                moveDirection={dir}
                isRestingSquare={dir == 0}
                nonce={nonce}
                handleCommitment={handleCommitment}
                playerAddr={player.addr}
                playerTokenId={player.tokenId}
                IDomGame={IDomGame}
              />
            );
          })}
        </div>
      ) : gameStage === GameStage.Reveal ? (
        <div>Reveal</div>
      ) : (
        <div>Resolving</div>
      )}
    </div>
  );
}
