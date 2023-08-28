import { UniswapInterfaceMulticall } from '@/classes/UniswapInterfaceMulticall';
import { useCore } from '@/store';


// combines the block timestamp with the user setting to give the deadline that
// should be used for any submitted transaction
export const getTransactionDeadline = async () => {
  const { account, appEnv } = useCore();
  if (!account.value || !appEnv.value) return 0;

  const ttl = 1800;

  const uniswapInterfaceMulticall = new UniswapInterfaceMulticall(
    appEnv.value.MULTICALL_ADDRESS,
    account.value.web3Provider,
  );

  const blockTimestamp = await uniswapInterfaceMulticall.methods.getCurrentBlockTimestamp();

  return blockTimestamp.add(ttl);
};
