import { EndaomentSdkApi, NdaoSdkFund, NdaoSdkOrg } from '@endaoment/sdk';

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
  Badge,
} from '@chakra-ui/react';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useNetwork } from 'wagmi';

function Discoverability({ sdk }: { sdk: EndaomentSdkApi }) {
  const { chain } = useNetwork();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchingForOrgs, setSearchingForOrgs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchedEntities, setSearchedEntities] = useState<(NdaoSdkFund | NdaoSdkOrg)[]>();

  const handleChangeEntityType = () => {
    setSearchingForOrgs(!searchingForOrgs);
    setSearchTerm('');
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);

    if (searchingForOrgs) setSearchedEntities(await sdk.searchOrgs({ searchTerm }));
    else setSearchedEntities(await sdk.searchVisibleFunds({ name: searchTerm }));

    setLoading(false);
    setSearchTerm('');
  };

  const isTestnet = chain?.id !== 1;

  return (
    <>
      <Flex alignItems="center" gap="2">
        <InputGroup>
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
          <Button onClick={handleSearch} isDisabled={!searchTerm} isLoading={loading}>
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
                    <Heading size="xs" verticalAlign="middle">
                      <HStack>
                        <span>{entity.name}</span>
                        {entity.contractAddress && <Badge colorScheme="blue">Deployed</Badge>}
                      </HStack>
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Flex alignItems="center" gap="8" p="4">
                  {entity.logoUrl && <Avatar src={entity.logoUrl} name={entity.name} size="2xl" />}
                  {entity.description && (
                    <p>
                      {parse(
                        `${entity.description.slice(0, 256)}${entity.description.length >= 256 ? '...' : ''}` || '',
                      )}
                    </p>
                  )}
                </Flex>

                <Flex mt="2" justifyContent="space-between">
                  <HStack>
                    <Text>{'ein' in entity ? `EIN ${entity.ein}` : ''}</Text>
                    {!!entity.contractAddress && (
                      <>
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
                      </>
                    )}
                  </HStack>

                  <VStack>
                    <Link
                      href={`https://app${isTestnet ? '.staging' : ''}.endaoment.org/${
                        searchingForOrgs ? 'orgs' : 'funds'
                      }/${entity.id}`}
                      target="_blank"
                    >
                      Endaoment <ExternalLinkIcon />
                    </Link>
                    {entity.contractAddress && (
                      <Link
                        href={`https://${isTestnet ? 'goerli.' : ''}etherscan.io/address/${entity.contractAddress}`}
                        target="_blank"
                        ml="1"
                      >
                        Etherscan <ExternalLinkIcon />
                      </Link>
                    )}
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
