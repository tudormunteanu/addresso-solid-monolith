import publicClient from "./viem_client";
import { loadCacheFromStorage, saveCacheToStorage } from "./cache";

const ENS_CACHE_KEY = "addressoEnsCache";

async function getEnsName(address: `0x${string}`) {
  const cache = loadCacheFromStorage();
  if (cache.has(address)) {
    return cache.get(address);
  }

  try {
    const ensName = await publicClient.getEnsName({ address });
    cache.set(address, ensName);
    saveCacheToStorage(cache);
    return ensName;
  } catch (error) {
    console.error(`Failed to resolve ENS for ${address}:`, error);
    return null;
  }
}

export default getEnsName; 