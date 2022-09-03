import React, { useContext } from 'react'
import { NextPage } from 'next'
import { CommonContext } from '@contexts/common'
import { Safe } from '@components/Safe'

const Home: NextPage = () => {
  const { safes } = useContext(CommonContext)
  return (
    <div className="w-full flex items-center flex-col gap-12 p-4">
      <img src="/logo.png" alt="logo" />
      {safes.map((safe) => (
        <Safe safeAddress={safe} key={safe} />
      ))}
      {!safes.length && <h2>You have no safes on this chain</h2>}
    </div>
  )
}

export default Home
