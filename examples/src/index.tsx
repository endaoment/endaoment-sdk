import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

const { chains } = configureChains([goerli, mainnet], [publicProvider()]);

const connectkitClient = getDefaultClient({
  appName: 'Endaoment SDK - Examples',
  chains,
  infuraId: '3645d258bf3848ebaf1ca4c5edf08e65',
});
const client = createClient({
  ...connectkitClient,

  // Empty storage so that we don't persist any data
  // Used so that we can run the examples in an iframe
  storage: { getItem: () => null, setItem: () => null, removeItem: () => null },
});

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  </StrictMode>,
);
