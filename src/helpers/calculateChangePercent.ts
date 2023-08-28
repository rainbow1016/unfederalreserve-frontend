
export const calculateChangePercent = (v1: number, v2: number) => {
  if (v1 + v2 === 0) return 0;
  if (v2 === 0) return 100;
  return (v1 * 100) / v2 - 100;
};
