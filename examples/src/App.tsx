import { Container, Heading, Tabs, TabList, Tab, TabPanels, TabPanel, Text, Divider, Flex } from '@chakra-ui/react';
import { Configuration, EndaomentSdkApi } from '@endaoment/sdk';
import { ConnectKitButton } from 'connectkit';

import Discoverability from './sections/Discoverability';
import EntityDeploy from './sections/EntityDeploy';

// const config = new Configuration({ network: 'goerli' });
const config = new Configuration({ network: 'local' });
const sdk = new EndaomentSdkApi(config);

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
  return (
    <Container maxW="4xl" p="4" mt="16">
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading size="md">Endaoment SDK</Heading>
        <ConnectKitButton theme="soft" />
      </Flex>

      <Tabs variant="enclosed-colored">
        <TabList>
          <Tab>Discoverability</Tab>
          <Tab>Org Deployment</Tab>
          <Tab>Financials</Tab>
          <Tab>Charitable Giving</Tab>
          <Tab>Stats</Tab>
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
            title="Entity Financial Standings"
            description="Find orgs and proportionally payout for QF and other charitable events. Find orgs with low donation count and help out! ---> BLOCKED by Subgraph"
          >
            <></>
          </CustomTabPanel>

          <CustomTabPanel
            title="Donating to Endaoment Entities"
            description="Easily get token quotes and donate to your favorite org or fund"
          >
            <></>
          </CustomTabPanel>

          <CustomTabPanel title="Stats for Endaoment Entities" description="..">
            <></>
          </CustomTabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default App;
