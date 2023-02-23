import React from 'react';
import ReactDOM from 'react-dom/client';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, foundry } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

const { chains } = configureChains([mainnet, foundry], [publicProvider()]);

const client = createClient(getDefaultClient({ appName: 'Endaoment SDK Examples', chains }));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);
