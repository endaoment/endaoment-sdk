import { Configuration, EndaomentSdkApi, OrgDto } from '@endaoment/sdk';

import { useState } from 'react';
import {
  Container,
  Input,
  Button,
  Stat,
  StatLabel,
  StatHelpText,
  Flex,
  Box,
  Heading,
  Spacer,
  ButtonGroup,
  Divider,
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
    <Container padding={10}>
      <Flex alignItems="center" gap="2">
        <Box p="2">
          <Heading size="sm">Endaoment Org Search</Heading>
        </Box>

        <Spacer />

        <Input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search for an org" />

        <Spacer />

        <ButtonGroup gap="2">
          <Button onClick={handleSearch} isDisabled={!search} isLoading={loading} colorScheme="blackAlpha">
            Search
          </Button>
        </ButtonGroup>
      </Flex>

      <Divider margin={4} />

      <Flex direction={'column'} gap="2" padding={5}>
        {searchResultOrgs?.length === 0 && <Stat>No results found</Stat>}
        {searchResultOrgs?.map((org) => (
          <Stat>
            <StatLabel>{org.name}</StatLabel>
            <StatHelpText>{org.contractAddress}</StatHelpText>
          </Stat>
        ))}
      </Flex>
    </Container>
  );
}

export default App;
