import {
  Alchemy,
  AssetTransfersCategory,
  AssetTransfersResult,
} from "alchemy-sdk";
import { loadCacheFromStorage, saveCacheToStorage } from "./cache";

function getCacheKey(address: string, categories: AssetTransfersCategory[]): string {
  return `transfers_${address}_${categories.join('_')}`;
}

async function fetchAssetTransfers(
  alchemy: Alchemy,
  address: string,
  categories: AssetTransfersCategory[]
): Promise<AssetTransfersResult> {
  const cache = loadCacheFromStorage();
  const cacheKey = getCacheKey(address, categories);
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData as AssetTransfersResult;
  }

  // If not in cache, fetch from API
  const result = await alchemy.core.getAssetTransfers({
    fromAddress: address,
    category: categories,
    maxCount: 1000,
  });

  // Cache the result
  cache.set(cacheKey, result);
  saveCacheToStorage(cache);

  // @ts-ignore
  return result as AssetTransfersResult;
}

export { fetchAssetTransfers };
