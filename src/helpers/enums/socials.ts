/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable global-require */


export const YOUTUBE = {
  icon: require('@/assets/images/social/youtube.svg'),
  href: 'https://www.youtube.com/channel/UCcKaHJ8SdyAGqoMrVrsKK_A',
} as const;

export const DISCORD = {
  icon: require('@/assets/images/social/discord.svg'),
  href: 'https://discord.gg/unfederalreserve',
} as const;

export const LINKEDIN = {
  icon: require('@/assets/images/social/linkedin.svg'),
  href: 'https://www.linkedin.com/company/unfederalreserve',
} as const;

export const FACEBOOK = {
  icon: require('@/assets/images/social/facebook.svg'),
  href: 'https://www.facebook.com/residualtoken',
} as const;

export const TELEGRAM = {
  icon: require('@/assets/images/social/telegram.svg'),
  href: 'https://t.me/unfedres_staking',
} as const;

export const TWITTER = {
  icon: require('@/assets/images/social/twitter.svg'),
  href: 'https://twitter.com/Unfederalreser1',
} as const;

export const DEFI = {
  icon: require('@/assets/images/social/defi.svg'),
  href: 'https://defipulse.com/defi-lending',
} as const;

export const YOUTUBE_INVITE = {
  icon: require('@/assets/images/social/youtube_big.svg'),
  href: YOUTUBE.href,
  description: 'Watch video tutorials about Reserve Lending Platform',
} as const;

export const DISCORD_INVITE = {
  icon: require('@/assets/images/social/discord_big.svg'),
  href: 'https://discord.com/invite/A4MyW7g',
  description: 'Ask your question to the support on discord',
} as const;
