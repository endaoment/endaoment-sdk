import { EndaomentSdkApi, OrgDto, TransactionDto } from '@endaoment/sdk';

import { useState } from 'react';
import {
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  Code,
  VStack,
  IconButton,
  TagRightIcon,
  Tooltip,
} from '@chakra-ui/react';
import { ArrowRightIcon, ChevronRightIcon, InfoIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi';

function EntityDeploy({ sdk }: { sdk: EndaomentSdkApi }) {
  const [searchedEIN, setSearchedEIN] = useState('872061793');
  const [loading, setLoading] = useState(false);
  const [deployTransaction, setDeployTransaction] = useState<TransactionDto>();
  const { config, error } = usePrepareSendTransaction({
    enabled: !!deployTransaction,
    request: { to: deployTransaction?.to as string, data: deployTransaction?.data as string },
  });
  const { sendTransaction } = useSendTransaction(config);

  const handleSearch = async () => {
    setLoading(true);
    try {
      setDeployTransaction(await sdk.getOrgDeployTransaction({ ein: searchedEIN }));
    } catch {
      setDeployTransaction(undefined);
    } finally {
      setLoading(false);
      setSearchedEIN('');
    }
  };

  const handleDeployOrg = async () => {
    if (deployTransaction && sendTransaction) sendTransaction();
    else console.error('No deploy transaction or sendTransaction function');

    console.log(deployTransaction, sendTransaction, error);
  };

  return (
    <>
      <Flex alignItems="center" gap="2" justifyContent="center">
        <NumberInput value={searchedEIN} onChange={setSearchedEIN}>
          <NumberInputField placeholder="Org EIN" />
        </NumberInput>
        <Button onClick={handleSearch} isDisabled={!searchedEIN} isLoading={loading}>
          Search Org by EIN
        </Button>
      </Flex>

      <VStack my={4}>
        {deployTransaction && (
          <>
            <Code p={8}>
              {'{'}
              <br />
              {`"to": "${deployTransaction.to}",`}{' '}
              <Tooltip label="Endaoment's `OrgFundFactory` contract address">
                <InfoIcon />
              </Tooltip>{' '}
              <br />
              {`"data": "${deployTransaction.data}",`}{' '}
              <Tooltip label="The calldata required to deploy this specific Org">
                <InfoIcon />
              </Tooltip>{' '}
              <br />
              {`"value": ${deployTransaction.value}`}{' '}
              <Tooltip label="For entity deployments, this will always be 0 since no ETH is required">
                <InfoIcon />
              </Tooltip>{' '}
              <br />
              {'}'}
              <br />
            </Code>

            <Button onClick={handleDeployOrg} rightIcon={<ChevronRightIcon />} aria-label="Deploy Org">
              Deploy Org
            </Button>
          </>
        )}
      </VStack>
    </>
  );
}

export default EntityDeploy;
