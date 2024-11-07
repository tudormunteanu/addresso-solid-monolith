import {
  Alchemy,
  AssetTransfersCategory,
  AssetTransfersResult,
} from "alchemy-sdk";
import { loadCacheFromFile, saveCacheToFile } from "./cache";

const CACHE_FILENAME = "./cache_alchemy.json";

async function fetchAssetTransfers(
  alchemy: Alchemy,
  address: string,
  categories: AssetTransfersCategory[]
): Promise<AssetTransfersResult> {
  const cacheKey = `${address}-${categories.join(",")}`;
  const cache = await loadCacheFromFile(CACHE_FILENAME);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const result = await alchemy.core.getAssetTransfers({
    fromAddress: address,
    category: categories,
    maxCount: 1000,
  });

  cache.set(cacheKey, result);
  await saveCacheToFile(CACHE_FILENAME, cache);

  // @ts-ignore
  return result as AssetTransfersResult;
}

export { fetchAssetTransfers };
