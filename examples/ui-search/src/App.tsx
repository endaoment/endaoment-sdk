import { Configuration, EndaomentSdkApi, FundDto, OrgDto } from '@endaoment/sdk';

import { useState } from 'react';
import parse from 'html-react-parser';
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
  Avatar,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const config = new Configuration({ network: 'goerli' });
const sdk = new EndaomentSdkApi(config);

function App() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedEntities, setSearchedEntities] = useState<(FundDto | OrgDto)[]>();

  const handleSearch = async () => {
    setLoading(true);
    const [funds, orgs] = await Promise.all([
      sdk.searchVisibleFunds({ name: search }),
      sdk.searchDeployedOrgs({ name: search }),
    ]);
    setSearchedEntities([...funds, ...orgs]);
    setLoading(false);
    setSearch('');
  };

  return (
    <Container maxW="2xl" p="4" mt="16">
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
        {searchedEntities?.length === 0 && <Stat>No results found</Stat>}
        <Accordion>
          {searchedEntities?.map((entity) => (
            <AccordionItem key={entity.id}>
              <h2>
                <AccordionButton p="4">
                  <Box flex="1" textAlign="left">
                    <Heading size="sm">{entity.name}</Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Flex alignItems="center" gap="8" p="4">
                  {entity.logoUrl && <Avatar src={entity.logoUrl} name={entity.name} size="2xl" />}
                  <p>{parse(entity.description || '')}</p>
                </Flex>

                <Flex mt="2" justifyContent="space-between">
                  <span>
                    Contract{' '}
                    <Tag>
                      {entity.contractAddress.slice(0, 5)}...{entity.contractAddress.slice(-3)}
                    </Tag>
                    <Link href={`https://etherscan.io/address/${entity.contractAddress}`} target="_blank" ml="1">
                      <ExternalLinkIcon />
                    </Link>
                  </span>
                  <Link href={entity.endaomentUrl} target="_blank">
                    View on Endaoment
                  </Link>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
    </Container>
  );
}

export default App;
