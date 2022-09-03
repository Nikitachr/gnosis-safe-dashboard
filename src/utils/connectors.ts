import { Connectors } from 'web3-react'
import { SupportedChainId } from '@constants/chains'

const { InjectedConnector } = Connectors

export const injected = new InjectedConnector({
  supportedNetworks: Object.values(SupportedChainId) as number[],
})
