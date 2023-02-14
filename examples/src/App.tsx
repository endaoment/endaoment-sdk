import { Container, Heading, Tabs, TabList, Tab, TabPanels, TabPanel, Text, Divider } from '@chakra-ui/react';
import Discoverability from './sections/Discoverability';

const sections: { tab: string; title: string; description: string; component: () => JSX.Element }[] = [
  {
    tab: 'Discoverability',
    title: 'Org & Fund Discoverability',
    description: 'Discover orgs and funds to easily integrate into your project',
    component: Discoverability,
  },
  {
    tab: 'Financials',
    title: 'Entity Financial Standings',
    description:
      'Find orgs and proportionally payout for QF and other charitable events. Find orgs with low donation count and help out! ---> BLOCKED by Subgraph',
    component: () => <></>,
  },
  {
    tab: 'Org Deployment',
    title: 'Deploying an Org',
    description:
      'Get transaction data to deploy a given org. Help out orgs and expand Endaoment’s charitable outreach!',
    component: Discoverability,
  },
  {
    tab: 'Charitable Giving',
    title: 'Donating to Endaoment Entities',
    description: 'Easily get token quotes and donate to your favorite org or fund',
    component: Discoverability,
  },
  { tab: 'Stats', title: 'Stats for Endaoment Entities', description: '..', component: Discoverability },
];

function App() {
  return (
    <Container maxW="4xl" p="4" mt="16">
      <Tabs variant="enclosed-colored">
        <TabList>
          {sections.map((section) => (
            <Tab key={section.tab}>{section.tab}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {sections.map((section) => (
            <TabPanel key={section.title}>
              <Heading as="h2" mb={4} size="lg">
                {section.title}
              </Heading>
              <Text mb={4}>{section.description}</Text>

              <Divider my="4" />

              {section.component()}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default App;
