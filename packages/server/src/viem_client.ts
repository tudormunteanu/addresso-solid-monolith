import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
 
const publicClient = createPublicClient({ 
  chain: mainnet,
  batch: { multicall: true },
  transport: http()
})

export default publicClient;