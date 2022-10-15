import { BigNumber } from "ethers";
import moment from "moment";

export const formatGameStartTime = (gameStartTimestamp: BigNumber) => {
  return moment(gameStartTimestamp.mul(1000).toNumber()).toNow();
};
