import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import Safe from '@gnosis.pm/safe-core-sdk'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { CommonContext } from '@contexts/common'
import { useNotification } from 'web3uikit'
import { createAccountLink } from '@metamask/etherscan-link'
import { ethers } from 'ethers'
import { ERC20abi } from '@constants/ERC20abi'
import axios from 'axios'

export interface ISafeContext {
  owners: IOwner[]
  addOwner: (address: string) => void
  sendTransaction: (tokenAddress: string, value: string) => void
}

interface CovalentResponse {
  data: {
    items: {
      balance: string
      contractDecimals: string
      contract_ticker_symbol: string
    }[]
  }
}

export interface IOwner {
  address: string
  name?: string
  link: string
  balances: {
    symbol: string
    value: string
  }[]
}

const getTokenBalances = (chainId: number, account: string) => {
  return axios.get<CovalentResponse>(
    `https://api.covalenthq.com/v1/${chainId}/address/${account}/balances_v2/?key=${process.env.COVALENT_KEY}`,
  )
}

export const SafeContext = createContext<ISafeContext>(null as any)

export const SafeProvider: FC<PropsWithChildren<{ safeAddress: string }>> = ({ children, safeAddress }) => {
  const { account, ens, networkId, library, ethAdapter, safeService } = useContext(CommonContext)
  const [safeSdk, setSafeSdk] = useState<Safe>()
  const [owners, setOwners] = useState<IOwner[]>([])
  const [threshold, setThreshold] = useState(0)

  const dispatch = useNotification()

  useEffect(() => {
    if (!networkId || !account || !ethAdapter) return
    const initSafe = async () => {
      try {
        const sdk = await Safe.create({ ethAdapter, safeAddress })
        setSafeSdk(sdk)
        const ownerAddresses = await sdk.getOwners()
        const threshold = await sdk.getThreshold()
        const owners = await Promise.all(
          ownerAddresses.map(async (address) => {
            const ensName = await ens?.getName(address)
            let tokens = []
            try {
              const resp = await getTokenBalances(networkId, address)
              tokens = resp.data.data.items.map((el) => ({
                symbol: el.contract_ticker_symbol,

                value: ethers.utils.formatEther(el.balance),
              }))
            } catch {
              tokens = [{ symbol: 'ETH', value: ethers.utils.formatEther(await library.getBalance(address)) }]
            }
            return {
              address,
              name: ensName?.name || '',
              link: createAccountLink(address, networkId.toString()),
              balances: tokens,
            }
          }),
        )
        setOwners(owners)
        setThreshold(threshold)
      } catch {
        setSafeSdk(undefined)
      }
    }
    initSafe()
  }, [ethAdapter, safeAddress])

  const addOwner = useCallback(
    async (ownerAddress: string) => {
      if (!safeSdk || !safeService) return
      const safeTransaction = await safeSdk.getAddOwnerTx({ ownerAddress, threshold })
      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
      const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
      await safeService.proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: account || '',
        senderSignature: senderSignature.data,
      })
      dispatch({ type: 'info', message: 'transaction is pending', position: 'topR' })
    },
    [account, dispatch, safeAddress, safeSdk, safeService, threshold],
  )

  const sendTransaction = useCallback(
    async (address: string, value: string) => {
      if (!safeSdk || !safeService) return
      let tx: any
      if (address) {
        const contract = new ethers.Contract(address, ERC20abi)
        tx = {
          ...(await contract.populateTransaction.transfer(
            '0xc6D330E5B7Deb31824B837Aa77771178bD8e6713',
            ethers.utils.parseEther(value),
          )),
          value: '0',
          nonce: await safeService.getNextNonce(safeAddress),
        }
      } else {
        tx = {
          from: safeAddress,
          data: '0x',
          to: '0xc6D330E5B7Deb31824B837Aa77771178bD8e6713',
          value: ethers.utils.parseEther(value).toString(),
          nonce: await library.getTransactionCount(safeAddress, 'latest'),
          gasLimit: ethers.utils.hexlify(10000),
        }
      }
      const safeTransaction = await safeSdk.createTransaction(tx)
      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
      const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
      await safeService.proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: account || '',
        senderSignature: senderSignature.data,
      })
      dispatch({ type: 'info', message: 'transaction is pending', position: 'topR' })
    },
    [account, dispatch, library, safeAddress, safeSdk, safeService],
  )

  return <SafeContext.Provider value={{ owners, addOwner, sendTransaction }}>{children}</SafeContext.Provider>
}
