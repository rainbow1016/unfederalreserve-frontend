export const enum MetamaskErrors {
  already_pending = -32002,
}

// https://docs.metamask.io/guide/ethereum-provider.html#errors
export interface IMetamaskError {
  code: number;
  message: string;
  data?: unknown;
}
