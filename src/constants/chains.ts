export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
  OPTIMISM = 10,
  BINANCE = 56,
  GNOSIS = 100,
  POLYGON = 137,
  GOERLI = 5,
  ARBITRUM = 42161,
  ACALANCHE = 43114,
  AURORA = 1313161554,
}

export const gnosisApiMap: { [key: number]: string } = {
  [SupportedChainId.MAINNET]: 'https://safe-transaction.mainnet.gnosis.io/',
  [SupportedChainId.RINKEBY]: 'https://safe-transaction.rinkeby.gnosis.io/',
  [SupportedChainId.OPTIMISM]: 'https://safe-transaction.optimism.gnosis.io/',
  [SupportedChainId.BINANCE]: 'https://safe-transaction.bsc.gnosis.io/',
  [SupportedChainId.GNOSIS]: 'https://safe-transaction.xdai.gnosis.io/',
  [SupportedChainId.POLYGON]: 'https://safe-transaction.polygon.gnosis.io/',
  [SupportedChainId.GOERLI]: 'https://safe-transaction.goerli.gnosis.io/',
  [SupportedChainId.ARBITRUM]: 'https://safe-transaction.arbitrum.gnosis.io/',
  [SupportedChainId.ACALANCHE]: 'https://safe-transaction.avalanche.gnosis.io/',
  [SupportedChainId.AURORA]: 'https://safe-transaction.aurora.gnosis.io/',
}
