export const contracts = {
  mumbai: {
    gameAddress: "0x54Bbcc474CE31Bb735912956ed5BaC0d858AAC58",
    baseCharacterNftAddress: "0x6B11648dd6054Da0C5195131D6A7cA5082E0d22D",
    baseCharacterIpfsUrl:
      "https://wortl.mypinata.cloud/ipfs/QmV5mkkBjD7BXGbPo1sg7EpMjxia2oJFF1coHJrvLz8dTg",
    abis: {
      game: require("./abis/DomStrategyGame.json").abi,
      baseCharacterNft: require("./abis/BaseCharacter.json").abi,
    },
  },
};
