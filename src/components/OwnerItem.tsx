import React, { FC } from 'react'
import { Blockie } from 'web3uikit'
import { getEllipsisTxt } from '@utils/index'
import { IOwner } from '@contexts/safe'

export const OwnerItem: FC<IOwner> = ({ address, name, link, balances }) => {
  return (
    <a href={link} className="grid gap-1 p-3 bg-white hover:bg-secondary">
      <div className="flex items-center gap-2">
        <Blockie size={5} seed={address} />
        <p className="font-medium">{name || getEllipsisTxt(address)}</p>
      </div>
      <div className="flex items-center gap-2">
        {balances.slice(0, 6).map((el) => (
          <div key={el.symbol}>
            <p>
              {el.symbol}: {el.value.substring(0, 6)}
            </p>
          </div>
        ))}
      </div>
    </a>
  )
}
