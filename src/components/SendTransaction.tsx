import React, { ChangeEvent, useCallback, useContext, useState } from 'react'
import { Button, Input } from 'web3uikit'
import { SafeContext } from '@contexts/safe'

export const SendTransaction = () => {
  const { sendTransaction } = useContext(SafeContext)
  const [tokenAddress, setTokenAddress] = useState('')
  const [value, setValue] = useState('')

  const onChangeAddress = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(event.target.value)
  }, [])

  const onChangeValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  return (
    <div className="p-2 bg-white rounded-xl w-full grid gap-8">
      <h3 className="font-bold truncate">
        Send transaction to <br />
        0xc6D330E5B7Deb31824B837Aa77771178bD8e6713
      </h3>
      <Input
        value={tokenAddress}
        onChange={onChangeAddress}
        label="Token address"
        width="100%"
        description="keep empty to send native tokens"
        placeholder="Token address"
      />
      <Input
        type="number"
        value={value}
        onChange={onChangeValue}
        label="Value to send"
        width="100%"
        placeholder="value"
      />
      <Button
        text="Send"
        size="large"
        theme="primary"
        isFullWidth
        onClick={() => sendTransaction(tokenAddress, value)}
      />
    </div>
  )
}
