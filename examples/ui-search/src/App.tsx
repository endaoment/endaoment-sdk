import { Configuration, EndaomentSdkApi, OrgDto } from '@endaoment/sdk';

import { useState } from 'react';
import {
  Container,
  Input,
  Button,
  Stat,
  Flex,
  Box,
  Heading,
  ButtonGroup,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tag,
  Link,
} from '@chakra-ui/react';

const config = new Configuration({ network: 'goerli' });
const sdk = new EndaomentSdkApi(config);

function App() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResultOrgs, setSearchResultOrgs] = useState<OrgDto[]>();

  const handleSearch = async () => {
    setLoading(true);
    const orgs = await sdk.searchDeployedOrgs({ name: search });
    setSearchResultOrgs(orgs);
    setLoading(false);
    setSearch('');
  };

  return (
    <Container p={16}>
      <Flex alignItems="center" gap="2">
        <Input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search Endaoment" />

        <ButtonGroup>
          <Button onClick={handleSearch} isDisabled={!search} isLoading={loading} colorScheme="blackAlpha">
            Search
          </Button>
        </ButtonGroup>
      </Flex>

      <Divider margin={4} />

      <Flex direction={'column'} gap="2" padding={5}>
        {searchResultOrgs?.length === 0 && <Stat>No results found</Stat>}
        <Accordion>
          {searchResultOrgs?.map((org) => (
            <AccordionItem>
              <h2>
                <AccordionButton p="4">
                  <Box flex="1" textAlign="left">
                    <Heading size="sm">{org.name}</Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <p>{org.description}</p>
                <Box p="2" mt="2">
                  Org Contract{' '}
                  <Link href={`https://etherscan.io/address/${org.contractAddress}`}>
                    <Tag>
                      {org.contractAddress.slice(0, 5)}...{org.contractAddress.slice(-3)}
                    </Tag>
                  </Link>
                  <br />
                  <span>View on Endaoment</span>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
    </Container>
  );
}

export default App;
