import { IProfits } from '@/types/api/profits';
import { IAllMarket, IAllMarketLight } from '@/types/api/allMarkets';
import { IAccountLiquidity, ILiquidationEvent } from '@/types/api/liquidity';
import { IGas } from '@/types/api/gas';
import { IEnv } from '@/global/env';


export const GAS_BASE_URL = 'https://ethgasstation.info/api/ethgasAPI.json?api-key=';

const handleError = <T>(response: Response) => {
  if (!response.ok) return Promise.reject(response);
  return response.json() as Promise<T>;
};

const requester = <T>(env: IEnv, path: string) => {
  const url = `${env.API_URL}/${path}`;

  return fetch(url).then((response) => (
    handleError<T>(response)
  ));
};


export const getProfits = (env: IEnv, account: string) => {
  const path = `profits?addr=${account}`;
  return requester<IProfits>(env, path);
};

export const getAllMarkets = (env: IEnv) => {
  const path = 'all_markets';
  return requester<IAllMarket[]>(env, path);
};

export const getMarketDetailsLight = (env: IEnv) => {
  const path = 'all_markets_light';
  return requester<IAllMarketLight[]>(env, path);
};

export const getAccountLiquidity = (env: IEnv) => {
  const path = 'account_liquidity?threshold=90';
  return requester<IAccountLiquidity[]>(env, path);
};

export const getLiquidationEvents = (env: IEnv) => {
  const path = 'liquidation_events';
  return requester<ILiquidationEvent[]>(env, path);
};

export const getGasPrice = (env: IEnv) => {
  const url = `${GAS_BASE_URL}${env.ETHERSCAN_API_KEY}`;

  return fetch(url).then((response) => (
    handleError<IGas>(response)
  ));
};
