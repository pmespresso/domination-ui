import React, { createContext, useEffect, useState } from "react";
import { useAccount, useContractReads, useSigner } from "wagmi";
import { contractReadsMumbaiGame, contracts } from "@/constants";
import { BigNumber, utils } from "ethers";
import { Interface } from "ethers/lib/utils";

interface GameStateContextType {
  currentTurn: BigNumber;
  gameStartTimestamp: BigNumber;
  numberOfActivePlayers: BigNumber;
  interval: BigNumber;
  spoils: BigNumber;
  nextAvailableAllianceId: BigNumber;
  nonce?: number;
  gameStarted: boolean;
  hasJoinedGame: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  IDomGame?: Interface;
}

export const GameStateContext = createContext({} as GameStateContextType);

interface Props {
  children: React.ReactNode;
}

export function GameStateContextProvider(props: Props) {
  const { children } = props;
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [hasJoinedGame, setHasJoinedGame] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<BigNumber>(BigNumber.from(0));
  const [spoils, setSpoils] = useState<BigNumber>(BigNumber.from(0));
  const [gameStartTimestamp, setGameStartTimestamp] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [numberOfActivePlayers, setNumberOfActivePlayers] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [upkeepInterval, setUpkeepInterval] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [IDomGame, setInterface] = useState<Interface>();
  const [nonce, setNonce] = useState<number>();
  const [nextAvailableAllianceId, setNextAvailableAllianceId] =
    useState<BigNumber>(BigNumber.from(0));

  const { data, isLoading, isSuccess } = useContractReads({
    contracts: [
      {
        ...contractReadsMumbaiGame,
        functionName: "currentTurn",
      },
      {
        ...contractReadsMumbaiGame,
        functionName: "spoils",
        args: [address],
      },
      {
        ...contractReadsMumbaiGame,
        functionName: "gameStartTimestamp",
      },
      {
        ...contractReadsMumbaiGame,
        functionName: "activePlayersCount",
      },
      {
        ...contractReadsMumbaiGame,
        functionName: "interval",
      },
      {
        ...contractReadsMumbaiGame,
        functionName: "gameStarted",
      },
      {
        ...contractReadsMumbaiGame,
        functionName: "nextAvailableAllianceId",
      },
    ],
  });

  useEffect(() => {
    if (data) {
      const [
        currentTurn,
        spoils,
        gameStartTimestamp,
        activePlayersCount,
        interval,
        _gameStarted,
        nextAvailableAllianceId,
      ] = data;

      if (currentTurn && BigNumber.from(currentTurn).gt(0)) {
        setCurrentTurn(BigNumber.from(currentTurn));
      }

      if (activePlayersCount && BigNumber.from(activePlayersCount).gt(0)) {
        setNumberOfActivePlayers(BigNumber.from(activePlayersCount));
      }

      if (spoils && BigNumber.from(spoils).gt(0)) {
        setHasJoinedGame(true);
        setSpoils(BigNumber.from(spoils));
      }

      if (gameStartTimestamp && BigNumber.from(gameStartTimestamp).gt(0)) {
        setGameStartTimestamp(BigNumber.from(gameStartTimestamp));
      }

      if (interval && BigNumber.from(interval).gt(0)) {
        setUpkeepInterval(BigNumber.from(interval));
      }

      if (
        nextAvailableAllianceId &&
        BigNumber.from(nextAvailableAllianceId).gt(0)
      ) {
        setNextAvailableAllianceId(BigNumber.from(nextAvailableAllianceId));
      }

      setGameStarted(_gameStarted as unknown as boolean);
    }
  }, [data]);

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
    setInterface(new utils.Interface(contracts.mumbai.abis.game));
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        currentTurn,
        spoils,
        hasJoinedGame,
        gameStartTimestamp,
        numberOfActivePlayers,
        interval: upkeepInterval,
        nonce,
        gameStarted,
        isLoading,
        isSuccess,
        IDomGame,
        nextAvailableAllianceId,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
