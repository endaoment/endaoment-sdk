import {
  Container,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Divider,
  Flex,
  VStack,
  Select,
} from '@chakra-ui/react';
import { Configuration, EndaomentSdkApi } from '@endaoment/sdk';
import { ConnectKitButton } from 'connectkit';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import CharitableGiving from './sections/CharitableGiving';

import Discoverability from './sections/Discoverability';
import EntityDeploy from './sections/EntityDeploy';
import { useMemo } from 'react';

const CustomTabPanel = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: JSX.Element;
}) => (
  <TabPanel>
    <Heading my={4} size="md">
      {title}
    </Heading>
    <Text mb={4}>{description}</Text>

    <Divider my="4" />

    {children}
  </TabPanel>
);

function App() {
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();

  /**
   * SDK updates config based on chainId
   * mainnet - Prod API
   * goerli - Staging API
   */
  const sdk = useMemo(
    () => new EndaomentSdkApi(new Configuration({ network: chain?.id === 1 ? 'mainnet' : 'goerli' })),
    [chain?.id],
  );

  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chainId = +e.target.value;
    switchNetwork?.(chainId);
  };

  return (
    <Container maxW="4xl" p="4" mt="16">
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading size="md">Endaoment SDK - Examples</Heading>
        <VStack spacing="1">
          <ConnectKitButton theme="soft" />

          {chain?.id && chains.length > 1 && (
            <Select variant="flushed" value={chain.id} onChange={handleChainChange} placeholder="Select Network">
              {chains.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </Select>
          )}
        </VStack>
      </Flex>

      <Tabs variant="enclosed-colored">
        <TabList>
          <Tab>Discoverability</Tab>
          <Tab>Org Deployment</Tab>
          <Tab>Charitable Giving</Tab>
        </TabList>

        <TabPanels>
          <CustomTabPanel
            title="Org & Fund Discoverability"
            description="Discover orgs and funds to easily integrate into your project"
          >
            <Discoverability sdk={sdk} />
          </CustomTabPanel>

          <CustomTabPanel
            title="Deploying an Org"
            description="Get transaction data to deploy a given org. Help out orgs and expand Endaoment and crypto's charitable outreach!"
          >
            <EntityDeploy sdk={sdk} />
          </CustomTabPanel>

          <CustomTabPanel
            title="Donating to Endaoment Entities"
            description="Easily get token quotes and donate to your favorite org or fund"
          >
            <CharitableGiving sdk={sdk} />
          </CustomTabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default App;
