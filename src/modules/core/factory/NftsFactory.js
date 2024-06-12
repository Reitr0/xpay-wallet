import { configProperties } from "@modules/core/config/config.properties";
import axios from "axios";
import { CHAIN_LIST_MAP } from "@modules/core/constant/constant";


export class NftsFactory {

  static async getNfts(chain, walletAddress) {
    try {

      const chains = CHAIN_LIST_MAP[chain];
      let requests: Promise<any>[] = [];
      for (let i = 0; i < chains.length; i++) {
        const chain = chains[i];
        const url =
          configProperties.moralis.api +
          "/v2/" +
          walletAddress +
          "/nft?chain=" +
          chain +
          "&format=decimal";
        requests.push(axios.get(url, {
          headers: {
            "X-API-Key": configProperties.moralis.key,
          },
        }));
      }
      let results = await Promise.all(requests);
      const nfts = [];
      for (let index = 0; index < results.length; index++) {
        const { data } = results[index];
        const result = data.result;
        for (let i = 0; i < result.length; i++) {
          const nft = result[i];
          if (nft.metadata !== null) {
            nft.metadata = JSON.parse(nft.metadata);
            nfts.push(nft);
          }
        }
      }
      return nfts;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  static getNftUrl(chain, tokenId, tokenAddress) {
    let url = `${configProperties.bsc.explore}/nft/${tokenAddress}/${tokenId}`;
    switch (chain) {
      case "ETH":
        url = `${configProperties.eth.explore}/nft/${tokenAddress}/${tokenId}`;
        break;
      case "POLYGON":
        url = `${configProperties.polygon.explore}/nft/${tokenAddress}/${tokenId}`;
        break;
      default:
        break;
    }
    return url;
  };

}
