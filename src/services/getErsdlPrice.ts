import { providers, Contract } from 'ethers';
import { IEnv } from '@/global/env';
import { Comptroller } from '@/classes/Comptroller';
import OracleABI from '@/global/abi/Oracle-abi.json';
import { GOracle } from '@/types/generated/GOracle';


export const getErsdlPrice = async (env: IEnv | null) => {
  if (!env) return 0;

  // eslint-disable-next-line no-underscore-dangle
  const InfuraProvider = new providers.InfuraProvider(env._NETWORK_ID);

  const comptroller = new Comptroller(
    env.COMPTROLLER_ADDRESS,
    InfuraProvider,
  );

  const oracleAddress = await comptroller.methods.oracle();

  const oracle = new Contract(
    oracleAddress,
    OracleABI,
    InfuraProvider,
  ) as unknown as Contract & GOracle;

  const price = await oracle.assetPrices(env.eRSDL_ADDRESS);

  return +price / 1e18;
};
