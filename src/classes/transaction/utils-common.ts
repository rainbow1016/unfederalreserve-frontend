export enum TransactionTypes {
  approve = 'approve',
  borrow = 'borrow',
  repay = 'repay',
  supply = 'supply',
  withdraw = 'withdraw',

  collateral = 'collateral',
}

export const enum TransactionActionTypes {
  wallet_confirm_request,
  wallet_confirmed,
  wallet_confirm_deny,

  approve_confirmed,
  approve_failed,

  mint_confirmed,
  mint_failed,

  redeem_confirmed,
  redeem_failed,

  borrow_confirmed,
  borrow_failed,

  repay_borrow_confirmed,
  repay_borrow_failed,

  allocate_to_confirmed_ether,
  allocate_to_confirmed,
  allocate_to_failed,

  exit_market_confirmed,
  exit_market_failed,

  enter_market_confirmed,
  enter_market_failed,

  claim_rewards_confirmed,
  claim_rewards_failed,

  add_token_to_metamask_confirmed,
  add_cToken_to_metamask_confirmed,
  add_token_to_metamask_failed,

  add_uniswap_position_confirmed,
  add_uniswap_position_failed,

  remove_liquidity_from_uniswap_position_confirmed,
  remove_liquidity_from_uniswap_position_failed,

  collect_fees_position_confirmed,
  collect_fees_position_failed,
}

export type ITransactionTabOption = {
  value: TransactionTypes;
  label: string;
  max_label?: string;
  max_tooltip?: string;
  loading: boolean;
  approve?: boolean;
  checkbox?: boolean;
  disabled?: boolean;
  tooltipText?: string;
  color?: string;
}

export const TRANSACTION_TAB_OPTIONS: Record<TransactionTypes, ITransactionTabOption> = {
  [TransactionTypes.approve]: {
    value: TransactionTypes.approve,
    label: 'Approve',
    loading: false,
    approve: true,
  },
  [TransactionTypes.collateral]: {
    value: TransactionTypes.collateral,
    label: 'Collateral',
    max_label: 'Max',
    loading: false,
  },
  [TransactionTypes.supply]: {
    value: TransactionTypes.supply,
    label: 'Supply',
    max_label: 'Max',
    max_tooltip: `
      Value may differ from your wallet's value,
      but don't worry, we will supply maximum under the hood.
    `,
    loading: false,
    approve: true,
    color: '#00d395',
  },
  [TransactionTypes.withdraw]: {
    value: TransactionTypes.withdraw,
    label: 'Withdraw',
    max_label: 'Max',
    loading: false,
    color: '#ea9650',
  },
  [TransactionTypes.borrow]: {
    value: TransactionTypes.borrow,
    label: 'Borrow',
    checkbox: true,
    max_label: '80%<br>limit',
    loading: false,
    color: '#ea9650',
  },
  [TransactionTypes.repay]: {
    value: TransactionTypes.repay,
    label: 'Repay',
    max_label: 'Max',
    loading: false,
    approve: true,
    color: '#00d395',
  },
} as const;
