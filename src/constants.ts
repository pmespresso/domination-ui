export const contracts = {
  mumbai: {
    gameAddress: "0x34e42ffa438f60eff68084748a2e686d9259207f",
    baseCharacterNftAddress: "0x3b83d7cddf9e2323caa76fdac5df82081a5f0d99",
    baseCharacterIpfsUrl:
      "https://wortl.mypinata.cloud/ipfs/QmV5mkkBjD7BXGbPo1sg7EpMjxia2oJFF1coHJrvLz8dTg",
    abis: {
      game: require("./abis/DomStrategyGame.json").abi,
      baseCharacterNft: require("./abis/BaseCharacter.json").abi,
    },
  },
};
