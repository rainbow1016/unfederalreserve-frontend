
export enum BorrowLimitTypes {
  normal = 'normal',
  warning = 'warning',
  danger = 'danger',
  critical = 'critical',
}

export const getBorrowLimitType = (percent: number) => {
  switch (true) {
    case percent < 75:
      return BorrowLimitTypes.normal;

    case percent < 80:
      return BorrowLimitTypes.warning;

    case percent < 90:
      return BorrowLimitTypes.danger;

    default:
      return BorrowLimitTypes.critical;
  }
};
