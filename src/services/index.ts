import { StorageService } from './StorageService';


type IAccount = {
  provider: string;
  ethAccount: string;
  chainId: number;
  active: boolean;
}

const name = [
  '[',
  process.env.VUE_APP_SHORT_NAME,
  '-',
  process.env.VUE_APP_ENV,
  ']',
].join('');

export const storage = {
  testid_terms_for_use: new StorageService<string[]>('testid:terms_for_use'),
  accounts: new StorageService<IAccount[]>('accounts', name),
};
