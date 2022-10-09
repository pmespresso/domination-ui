export const contracts = {
  mumbai: {
    gameAddress: "0xb4dee75e2b5e5c7228afb4ad270d48f0f30fa99a",
    keeperAddress: "0x7f5cc1b0abfd7d5c08a6e01adc1dfd9b7041f757",
    baseCharacterNftAddress: "0x1643b6b44a1805cc31dcfa83b4fdac2607f643a9",
    baseCharacterIpfsUrl:
      "https://wortl.mypinata.cloud/ipfs/QmV5mkkBjD7BXGbPo1sg7EpMjxia2oJFF1coHJrvLz8dTg",
    abis: {
      game: require("./abis/DomStrategyGame.json").abi,
      keeper: require("./abis/GameKeeper.json").abi,
      baseCharacterNft: require("./abis/BaseCharacter.json").abi,
    },
  },
};
