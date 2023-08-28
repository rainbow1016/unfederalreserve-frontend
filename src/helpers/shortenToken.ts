export const shortenToken = (arg: string | null | undefined) => {
  if (!arg) return '';
  return `${arg.slice(0, 4)}...${arg.slice(-4)}`;
};
