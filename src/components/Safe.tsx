import React, { FC } from 'react'
import { SafeProvider } from '@contexts/safe'
import { OwnerList } from '@components/OwnerList'
import { AddOwner } from '@components/AddOwner'
import { SendTransaction } from '@components/SendTransaction'

export const Safe: FC<{ safeAddress: string }> = ({ safeAddress }) => {
  return (
    <SafeProvider safeAddress={safeAddress}>
      <div className="max-w-md w-full flex items-center flex-col gap-4">
        <OwnerList />
        <AddOwner />
        <SendTransaction />
      </div>
    </SafeProvider>
  )
}
