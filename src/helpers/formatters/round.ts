export const round = (n: number, precision: number) => {
  // ToDo
  // Use BigNumber to protect from overflow
  const prec = 10 ** precision;
  return Math.round(n * prec) / prec;
};
