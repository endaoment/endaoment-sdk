import { EndaomentSdkApi, NdaoSdkFund, NdaoSdkOrg } from '@endaoment/sdk';

import { useEffect, useState } from 'react';
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
import { useNetwork, useProvider } from 'wagmi';
import { getContract } from '@wagmi/core';
import { abi } from '../abis/OrgFundFactory.json';
import { KNOWN_ADDRESSES } from '../constants';
import { ethers } from 'ethers';

function Discoverability({ sdk }: { sdk: EndaomentSdkApi }) {
  const { chain } = useNetwork();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchingForOrgs, setSearchingForOrgs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchedEntities, setSearchedEntities] = useState<(NdaoSdkFund | NdaoSdkOrg)[]>();

  const handleChangeEntityType = () => {
    setSearchingForOrgs(!isSearchingForOrgs);
    setSearchTerm('');
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);

    if (isSearchingForOrgs) setSearchedEntities(await sdk.searchOrgs({ searchTerm }));
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
            placeholder={`Search Endaoment ${isSearchingForOrgs ? 'Orgs' : 'Funds'}`}
          />
          <InputRightElement
            width="12rem"
            children={
              <Stack direction="row">
                <Text>Funds</Text>
                <Switch
                  isChecked={isSearchingForOrgs}
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
          {searchedEntities?.map((e) => (
            <Entity key={e.id} entity={e} isTestnet={isTestnet} />
          ))}
        </Accordion>
      </Flex>
    </>
  );
}

const Entity = ({ entity, isTestnet }: { entity: NdaoSdkFund | NdaoSdkOrg; isTestnet?: boolean }) => {
  const provider = useProvider();

  const isOrg = 'ein' in entity;
  const isUSOrg = isOrg && !!entity.ein;
  const identifier = isUSOrg ? entity.ein : entity.id;
  const isDeployed = !!entity.contractAddress;

  const orgFundFactoryContract = getContract({
    address: KNOWN_ADDRESSES.OrgFundFactory,
    abi,
    signerOrProvider: provider,
  });

  const [contractAddress, setContractAddress] = useState(isDeployed ? entity.contractAddress : '');

  useEffect(() => {
    const getContractAddress = async () => {
      if (!isDeployed) {
        const contractAddress = await orgFundFactoryContract.computeOrgAddress(
          isUSOrg ? ethers.utils.formatBytes32String(identifier) : `0x${identifier.replace(/-/g, '').padEnd(64, '0')}`,
        );

        setContractAddress(contractAddress);
      }
    };

    getContractAddress();
  }, []);

  // console.log(entity, isOrg, isUSOrg, identifier, isDeployed, contractAddress);

  return (
    <AccordionItem>
      <h2>
        <AccordionButton p="4">
          <Box flex="1" textAlign="left">
            <Heading size="xs" verticalAlign="middle">
              <HStack>
                <span>{entity.name}</span>
                {isDeployed && <Badge colorScheme="blue">Deployed</Badge>}
                {!isUSOrg && <Text>🌍</Text>}
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
              {isUSOrg && (
                <>
                  US Org - EIN {entity.ein.slice(0, 2)}-{entity.ein.slice(2)}
                  <br />
                </>
              )}
              {parse(`${entity.description.slice(0, 256)}${entity.description.length >= 256 ? '...' : ''}` || '')}
            </p>
          )}
        </Flex>

        <Flex mt="2" justifyContent="space-between">
          <HStack>
            <Tooltip
              label={
                isDeployed
                  ? contractAddress
                  : 'Not yet deployed! This is the computed address this contract will be deployed to'
              }
            >
              <Tag>
                {contractAddress.slice(0, 5)}...{contractAddress.slice(-3)}
              </Tag>
            </Tooltip>
            <Tooltip label="Copy Contract Address">
              <IconButton
                onClick={() => navigator.clipboard.writeText(contractAddress)}
                icon={<CopyIcon />}
                aria-label="Copy Contract Address"
                size="xs"
              />
            </Tooltip>
          </HStack>

          <VStack>
            <Link
              href={`https://app${isTestnet ? '.staging' : ''}.endaoment.org/${isOrg ? 'orgs' : 'funds'}/${identifier}`}
              target="_blank"
            >
              Endaoment <ExternalLinkIcon />
            </Link>
            {contractAddress && (
              <Link
                href={`https://${isTestnet ? 'goerli.' : ''}etherscan.io/address/${contractAddress}`}
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
  );
};

export default Discoverability;
