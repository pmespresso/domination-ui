export const contracts = {
  mumbai: {
    gameAddress: "0xf7c11984861cE7224b0066721f1B7482da803e65",
    baseCharacterNftAddress: "0xC1aa55d00083f22749DB53e536aaBB962e7Ee9E4",
    baseCharacterIpfsUrl:
      "https://wortl.mypinata.cloud/ipfs/QmV5mkkBjD7BXGbPo1sg7EpMjxia2oJFF1coHJrvLz8dTg",
    abis: {
      game: require("./abis/DomStrategyGame.json").abi,
      baseCharacterNft: require("./abis/BaseCharacter.json").abi,
    },
  },
};
