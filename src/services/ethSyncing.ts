import { providers } from 'ethers';
import { IEnv } from '@/global/env';


export interface IEthSync {
  startingBlock: string;
  currentBlock: string;
  highestBlock: string;
}

export const ethSyncing = (env: IEnv | null) => {
  if (!env) return { syncing: void 0, block: void 0 };

  // eslint-disable-next-line no-underscore-dangle
  const provider = new providers.InfuraProvider(env._NETWORK_ID, env.INFURA_ID);

  const promises = [
    provider.send('eth_syncing', []) as Promise<IEthSync | boolean> | undefined,
    provider.getBlock('latest'),
  ] as const;

  return Promise.all(promises)
    .then(([syncing, block]) => ({ syncing, block }));
};
