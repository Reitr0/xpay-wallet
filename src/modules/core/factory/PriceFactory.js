import _ from "lodash";
import { configProperties } from "@modules/core/config/config.properties";
import axios from "axios";
import { Logs } from "@modules/log/logs";
import { StorageService } from "@modules/core/storage/StorageService";

export class PricesFactory {
  static async load(assets) {
    let prices = [];
    try {
      const shouldPriceRefresh = await StorageService.getItem("shouldPriceRefresh") || true;
      if (shouldPriceRefresh === false) {
        return await StorageService.getItem("noneCoinGeckoPrices");
      }
      const chunks = _.chunk(assets, 5);
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        let endpoints = _.map(chunk, function(item) {
          let config = {
            method: "get",
            timeout: 15000,
            headers: {
              "X-API-Key": configProperties.moralis.key,
            },
          };
          config.url = configProperties.moralis.api +
            "/v2/erc20/" +
            `${item.contract}` +
            "/price?chain=" +
            item.chain.toLowerCase();
          return axios(config).catch(err => {
            return {
              data: {
                usdPrice: 0,
              },
            };
          });
        });
        let results = await Promise.all(endpoints);
        for (let index = 0; index < results.length; index++) {
          const result = results[index];
          let price = 0;
          price = result.data.usdPrice;
          prices.push({
            [chunk[index].id]: {
              usd: price,
            },
          });
        }
      }
    } catch (e) {
      Logs.info("PricesFactory: load", e);
    }
    await StorageService.setItem("shouldPriceRefresh", false);
    await StorageService.setItem("noneCoinGeckoPrices", prices);
    return prices;
  }
}
