import { describe, it, expect } from 'vitest';
import { main } from './addresso';
import getEnsName from "./ens";
import { mapReplacer } from "./utils";


describe('fetch top 5 most recently interacted with addresses', () => {
    it('should return an array of addresses', async () => {
        const results = await main();

        console.log(JSON.stringify({ results }, mapReplacer, 2));
        // TODO: don't hardcode value unless certain
        expect(results.records.length).toBe(10);
    });
});

describe('resolve an ENS name', () => {
    it('should resolve an ENS name', async () => {
        const ensName = await getEnsName('0x225f137127d9067788314bc7fcc1f36746a3c3B5');
        expect(ensName).toBe('luc.eth');
    }, 10000);
});