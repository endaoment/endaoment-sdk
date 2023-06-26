import { EndaomentSdkApi, NdaoSdkOrg, NdaoSdkTransaction } from '@endaoment/sdk';

import { useState } from 'react';
import {
  Button,
  Flex,
  Code,
  VStack,
  Tooltip,
  InputGroup,
  Input,
  ButtonGroup,
  ListItem,
  UnorderedList,
  Text,
} from '@chakra-ui/react';
import { ChevronRightIcon, InfoIcon } from '@chakra-ui/icons';
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi';

function EntityDeploy({ sdk }: { sdk: EndaomentSdkApi }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [undeployedOrgs, setUndeployedOrgs] = useState<NdaoSdkOrg[]>([]);
  const [orgToDeploy, setOrgToDeploy] = useState<NdaoSdkOrg>();
  const [loading, setLoading] = useState(false);
  const [deployTransaction, setDeployTransaction] = useState<NdaoSdkTransaction>();
  const { config, error } = usePrepareSendTransaction({
    enabled: !!deployTransaction,
    request: { to: deployTransaction?.to as string, data: deployTransaction?.data as string },
    onError: (error) => console.error(error),
  });
  const { sendTransaction } = useSendTransaction(config);

  const handleSearch = async () => {
    setLoading(true);
    setUndeployedOrgs(await sdk.searchOrgs({ searchTerm, deployedStatus: 'undeployed' }));
    setLoading(false);
    setSearchTerm('');
  };

  const handleGetDeploymentData = async (org: NdaoSdkOrg) => {
    setOrgToDeploy(org);
    setDeployTransaction(await sdk.getOrgDeployTransaction(org));
  };

  const handleDeployOrg = async () => {
    if (deployTransaction && sendTransaction) sendTransaction();
    else console.error('No deploy transaction or sendTransaction function');

    console.log(deployTransaction, sendTransaction, error);
  };

  return (
    <>
      <Flex alignItems="center" gap="2">
        <InputGroup>
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for undeployed Endaoment Orgs"
          />
        </InputGroup>

        <ButtonGroup>
          <Button onClick={handleSearch} isDisabled={!searchTerm} isLoading={loading}>
            Search
          </Button>
        </ButtonGroup>
      </Flex>

      <VStack my="4">
        <Code p={4} w="100%">
          {deployTransaction && orgToDeploy && (
            <Text mb="4">{`// Transaction data to deploy ${orgToDeploy.name}`}</Text>
          )}
          {'{'}
          <br />
          <Text ml="4">
            <Text mr="2" display="inline">
              "to": "{`${deployTransaction?.to || '0x...'}",`}
            </Text>
            <Tooltip label="Endaoment's `OrgFundFactory` contract address">
              <InfoIcon />
            </Tooltip>{' '}
          </Text>
          <Text ml="4">
            <Text mr="2" display="inline">
              "data": "{`${deployTransaction?.data || '0x...'}",`}
            </Text>
            <Tooltip label="The calldata required to deploy this specific Org">
              <InfoIcon />
            </Tooltip>{' '}
          </Text>
          <Text ml="4">
            <Text mr="2" display="inline">
              "value": {`${deployTransaction?.value || '0'}`}
            </Text>
            <Tooltip label="For entity deployments, this will always be 0 since no ETH is required">
              <InfoIcon />
            </Tooltip>{' '}
          </Text>
          {'}'}
        </Code>

        {deployTransaction && (
          <Button onClick={handleDeployOrg} rightIcon={<ChevronRightIcon />} aria-label="Deploy Org">
            Deploy Org
          </Button>
        )}
      </VStack>

      <UnorderedList>
        {undeployedOrgs.map((org) => (
          <ListItem key={org.ein} mb={4}>
            <Text display="inline" mr="2">
              {org.name}
            </Text>
            <Button onClick={() => handleGetDeploymentData(org)} size="xs">
              Get Deployment Data
            </Button>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  );
}

export default EntityDeploy;
