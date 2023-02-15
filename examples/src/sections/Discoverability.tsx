import { EndaomentSdkApi, FundDto, OrgDto } from '@endaoment/sdk';

import { useState } from 'react';
import parse from 'html-react-parser';
import {
  Input,
  Button,
  Flex,
  Box,
  Heading,
  ButtonGroup,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tag,
  Link,
  Avatar,
  InputGroup,
  InputRightElement,
  Switch,
  Stack,
  Text,
  IconButton,
  HStack,
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';

function Discoverability({ sdk }: { sdk: EndaomentSdkApi }) {
  const [search, setSearch] = useState('');
  const [searchingForOrgs, setSearchingForOrgs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchedEntities, setSearchedEntities] = useState<(FundDto | OrgDto)[]>();

  const handleChangeEntityType = () => {
    setSearchingForOrgs(!searchingForOrgs);
    setSearch('');
  };

  const handleSearch = async () => {
    setLoading(true);

    if (searchingForOrgs) setSearchedEntities(await sdk.searchDeployedOrgs({ name: search }));
    else setSearchedEntities(await sdk.searchVisibleFunds({ name: search }));

    setLoading(false);
    setSearch('');
  };

  return (
    <>
      <Flex alignItems="center" gap="2">
        <InputGroup>
          <Input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder={`Search Endaoment ${searchingForOrgs ? 'Orgs' : 'Funds'}`}
          />
          <InputRightElement
            width="12rem"
            children={
              <Stack direction="row">
                <Text>Funds</Text>
                <Switch
                  isChecked={searchingForOrgs}
                  onChange={handleChangeEntityType}
                  size="lg"
                  colorScheme="twitter"
                />
                <Text>Orgs</Text>
              </Stack>
            }
          />
        </InputGroup>

        <ButtonGroup>
          <Button onClick={handleSearch} isDisabled={!search} isLoading={loading}>
            Search
          </Button>
        </ButtonGroup>
      </Flex>

      <Flex direction={'column'} gap="2" padding={5}>
        {searchedEntities?.length === 0 && <Text>No results found</Text>}
        <Accordion allowMultiple>
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
                  <HStack>
                    <Tooltip label={entity.contractAddress}>
                      <Tag>
                        {entity.contractAddress.slice(0, 5)}...{entity.contractAddress.slice(-3)}
                      </Tag>
                    </Tooltip>
                    <Tooltip label="Copy Contract Address">
                      <IconButton
                        onClick={() => navigator.clipboard.writeText(entity.contractAddress)}
                        icon={<CopyIcon />}
                        aria-label="Copy Contract Address"
                        size="xs"
                      />
                    </Tooltip>
                  </HStack>

                  <VStack>
                    <Link href={entity.endaomentUrl} target="_blank">
                      Endaoment <ExternalLinkIcon />
                    </Link>
                    <Link href={`https://etherscan.io/address/${entity.contractAddress}`} target="_blank" ml="1">
                      Etherscan <ExternalLinkIcon />
                    </Link>
                  </VStack>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
    </>
  );
}

export default Discoverability;
