import React, { createContext, FC, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import { gnosisApiMap } from '@constants/chains'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { ENS } from '@ensdomains/ensjs'
import { Provider } from '@ethersproject/abstract-provider'

export interface ICommonContext {
  ethAdapter?: EthersAdapter
  safeService?: SafeServiceClient
  safes: string[]
  account?: string | null
  ens?: ENS
  networkId?: number
  library: Provider
}

export const CommonContext = createContext<ICommonContext>(null as any)

export const CommonProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { setFirstValidConnector, networkId, library, account } = useWeb3Context()
  const [ethAdapter, setEthAdapter] = useState<EthersAdapter>()
  const [safes, setSafes] = useState<string[]>([])
  const [safeService, setSafeService] = useState<SafeServiceClient>()
  const [ens, setEns] = useState<ENS>()

  const txServiceUrl = useMemo(() => gnosisApiMap[networkId || 1], [networkId])

  useEffect(() => {
    setFirstValidConnector(['injected'])
  }, [setFirstValidConnector])

  useEffect(() => {
    const getSafes = async () => {
      if (!library || !networkId || !account) return
      const signer = await library.getSigner()
      const ethAdapter = new EthersAdapter({ ethers, signer })
      setEthAdapter(ethAdapter)

      const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
      setSafeService(safeService)

      const ens = new ENS()
      await ens.setProvider(library)
      setEns(ens)

      const { safes } = await safeService.getSafesByOwner(account)
      setSafes(safes)
    }
    getSafes()
  }, [account, library, networkId, txServiceUrl])

  return (
    <CommonContext.Provider value={{ ethAdapter, safes, safeService, account, ens, networkId, library }}>
      {children}
    </CommonContext.Provider>
  )
}
