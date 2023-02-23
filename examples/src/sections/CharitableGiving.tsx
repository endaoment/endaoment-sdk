import { EndaomentSdkApi, NdaoSdkDonationSwap } from '@endaoment/sdk';

import { useState } from 'react';
import {
  Button,
  Flex,
  Code,
  VStack,
  Tooltip,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  ListItem,
  UnorderedList,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { ChevronRightIcon, InfoIcon } from '@chakra-ui/icons';
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi';
import NumberFormatter from 'react-currency-format';

// Forked mainnet and goerli addresses
const TOKENS = [
  {
    symbol: 'ETH',
    decimals: 18,
    contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    symbol: 'WETH',
    decimals: 18,
    contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  {
    symbol: 'USDC',
    decimals: 6,
    contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  {
    symbol: 'LINK',
    decimals: 18,
    contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  },
];

function CharitableGiving({ sdk }: { sdk: EndaomentSdkApi }) {
  const [ein, setEin] = useState('844661797');
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [amountIn, setAmountIn] = useState('1');
  const [exp, setExp] = useState(1e18);
  const [loading, setLoading] = useState(false);
  const [swapAndDonateTransaction, setSwapAndDonateTransaction] = useState<NdaoSdkDonationSwap>();
  const { config, error } = usePrepareSendTransaction({
    request: {
      to: swapAndDonateTransaction?.to as string,
      data: swapAndDonateTransaction?.data as string,
      value: swapAndDonateTransaction?.value as string,
      gasLimit: 500_000,
    },
    onError: (error) => console.error(error),
  });
  const { sendTransaction } = useSendTransaction(config);

  const handleGetTransactionData = async () => {
    setLoading(true);
    setSwapAndDonateTransaction({
      ...(await sdk.getDonationSwapTransaction({
        ein,
        tokenContractAddress: selectedToken.contractAddress,
        amountIn: `${+amountIn * +exp}`,
      })),
    });
    setLoading(false);
  };

  const handleSwapAndDonate = async () => {
    if (swapAndDonateTransaction && sendTransaction) sendTransaction();
    else console.error('No deploy transaction or sendTransaction function');

    console.log(swapAndDonateTransaction, sendTransaction, error);
  };

  return (
    <>
      <Flex gap="4">
        <VStack flex="2">
          <InputGroup>
            <InputLeftAddon children="Deployed Org EIN" />
            <NumberInput
              onChange={(v) => setEin(v)}
              value={ein}
              onKeyDown={(e) => e.key === 'Enter' && handleGetTransactionData()}
              w="100%"
            >
              <NumberInputField placeholder="EIN" />
            </NumberInput>
          </InputGroup>

          <Select
            value={selectedToken.contractAddress}
            onChange={(v) => setSelectedToken(TOKENS.find((t) => t.contractAddress === v.target.value)!)}
          >
            {TOKENS.map((token) => (
              <option key={token.contractAddress} value={token.contractAddress}>
                {token.symbol}
              </option>
            ))}
          </Select>

          <Flex gap="2" w="100%">
            <NumberInput
              flex="3"
              onChange={(v) => setAmountIn(v)}
              value={amountIn}
              onKeyDown={(e) => e.key === 'Enter' && handleGetTransactionData()}
            >
              <NumberInputField
                placeholder={`Amount in ${selectedToken.symbol} (${selectedToken.decimals} decimals)`}
              />
            </NumberInput>

            <Select flex="1" value={exp} onChange={(v) => setExp(+v.target.value)}>
              <option value={1e18}>10^18</option>
              <option value={1e9}>10^9</option>
              <option value={1e6}>10^6</option>
              <option value={1e3}>10^3</option>
              <option value={1}>1</option>
            </Select>
          </Flex>
        </VStack>

        <Button onClick={handleGetTransactionData} isLoading={loading}>
          Get Swap & Donate Transaction
        </Button>
      </Flex>

      <VStack my="4">
        <Code p={4} w="100%">
          {'{'}
          <br />
          <Text ml="4">
            <Text mr="2" display="inline">
              "to": "{`${swapAndDonateTransaction?.to || '0x...'}",`}
            </Text>
            <Tooltip label="The address of the contract that will perform the swap & donate operation">
              <InfoIcon />
            </Tooltip>{' '}
          </Text>
          <Text ml="4">
            <Text mr="2" display="inline">
              "data": "{`${swapAndDonateTransaction?.data || '0x...'}",`}
            </Text>
            <Tooltip label="The calldata required to swap and donate this token to this org's contract">
              <InfoIcon />
            </Tooltip>{' '}
          </Text>
          <Text ml="4">
            <Text mr="2" display="inline">
              "value": {`${swapAndDonateTransaction?.value || '0'}`}
            </Text>
            <Tooltip label="If swapping for ETH/WETH, a value must be sent along">
              <InfoIcon />
            </Tooltip>{' '}
          </Text>
          {'}'}
        </Code>

        {swapAndDonateTransaction && (
          <Flex p="8" alignItems="center" gap="8">
            <UnorderedList>
              <ListItem>
                Expected USDC Output:{' '}
                <NumberFormatter
                  value={+swapAndDonateTransaction.quote.expectedUsdc / 1e6}
                  displayType="text"
                  thousandSeparator
                  prefix="$"
                  decimalScale={2}
                />
              </ListItem>
              <ListItem>
                Minimum USDC Output:{' '}
                <NumberFormatter
                  value={+swapAndDonateTransaction.quote.minimumTolerableUsdc / 1e6}
                  displayType="text"
                  thousandSeparator
                  prefix="$"
                  decimalScale={2}
                />
              </ListItem>
              <ListItem>
                Price Impact:{' '}
                <NumberFormatter
                  value={+swapAndDonateTransaction.quote.priceImpact}
                  displayType="text"
                  decimalScale={2}
                  suffix="%"
                />
              </ListItem>
            </UnorderedList>

            <Button
              onClick={handleSwapAndDonate}
              rightIcon={<ChevronRightIcon />}
              aria-label="Deploy Org"
              colorScheme="green"
            >
              Swap & Donate
            </Button>
          </Flex>
        )}
      </VStack>
    </>
  );
}

export default CharitableGiving;
