import React from 'react'
import { AppProps } from 'next/app'
import { injected } from '@utils/connectors'

import '@styles/tailwind.css'
import Web3Provider from 'web3-react'
import { CommonProvider } from '@contexts/common'
import { NotificationProvider } from 'web3uikit'

const App = ({ Component, pageProps }: AppProps) => (
  <Web3Provider connectors={{ injected }} libraryName="ethers.js">
    <CommonProvider>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </CommonProvider>
  </Web3Provider>
)

export default App
