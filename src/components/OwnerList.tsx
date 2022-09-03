import React, { useContext } from 'react'
import { OwnerItem } from '@components/OwnerItem'
import { SafeContext } from '@contexts/safe'

export const OwnerList = () => {
  const { owners } = useContext(SafeContext)
  return (
    <div className="w-full rounded-xl overflow-hidden">
      {owners.map((owner) => (
        <OwnerItem {...owner} key={owner.address} />
      ))}
    </div>
  )
}
