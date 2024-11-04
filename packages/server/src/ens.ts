/*
    Integration with ENS
*/

import publicClient from './viem_client';
import { loadCacheFromFile, saveCacheToFile } from './cache';

const CACHE_FILENAME = './cache_ens.json';

async function getEnsName(address: `0x${string}`) {
    const cache = await loadCacheFromFile(CACHE_FILENAME);
    if (cache.has(address)) {
        return cache.get(address)!;
    }

    const ensName = await publicClient.getEnsName({address});
    cache.set(address, ensName);
    await saveCacheToFile(CACHE_FILENAME, cache);

    return ensName;
}

export default getEnsName;