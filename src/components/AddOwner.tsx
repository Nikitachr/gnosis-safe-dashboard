import React, { ChangeEvent, useCallback, useContext, useState } from 'react'
import { Button, Input } from 'web3uikit'
import { SafeContext } from '@contexts/safe'
import { ethers } from 'ethers'

export const AddOwner = () => {
  const { addOwner } = useContext(SafeContext)

  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  const submit = useCallback(() => {
    if (ethers.utils.isAddress(value)) {
      addOwner(value)
      setError('')
      return
    }
    setError('invalid address')
  }, [addOwner, value])

  return (
    <div className="p-2 pb-4 gap-2 bg-white rounded-xl w-full flex items-center whitespace-nowrap">
      <Input
        state={error ? 'error' : 'initial'}
        errorMessage={error}
        value={value}
        onChange={onChange}
        placeholder="address"
      />
      <Button text="Add Owner" theme="primary" size="large" onClick={submit} />
    </div>
  )
}
