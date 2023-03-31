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
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useContractRead,
  erc20ABI,
  Address,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi';
import NumberFormatter from 'react-currency-format';
import { parseUnits } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';

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
    symbol: 'DAI',
    decimals: 18,
    contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
];

function CharitableGiving({ sdk }: { sdk: EndaomentSdkApi }) {
  const { address } = useAccount();

  const [ein, setEin] = useState('844661797');
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [amountIn, setAmountIn] = useState('1');
  const [amountInParsed, setAmountInParsed] = useState(
    parseUnits(amountIn || '0', selectedToken.decimals)
  );
  const [loading, setLoading] = useState(false);
  const [swapAndDonateTransaction, setSwapAndDonateTransaction] =
    useState<NdaoSdkDonationSwap>();

  // Send swap and donate transaction
  const { config: config1 } = usePrepareSendTransaction({
    request: {
      to: swapAndDonateTransaction?.to as string,
      data: swapAndDonateTransaction?.data as string,
      value: swapAndDonateTransaction?.value as string,
      gasLimit: 1_000_000,
    },
    enabled: !!swapAndDonateTransaction,
    onError: (error) => console.error(error),
  });
  const { sendTransaction } = useSendTransaction(config1);

  const isETH = selectedToken.symbol === 'ETH';

  const { data: entityAllowance } = useContractRead({
    address: selectedToken.contractAddress as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as Address, swapAndDonateTransaction?.to as Address],
    enabled: !isETH && !!address && !!swapAndDonateTransaction?.to,
    watch: true,
  });

  const { config: config2 } = usePrepareContractWrite({
    address: selectedToken.contractAddress as Address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [swapAndDonateTransaction?.to as Address, amountInParsed],
    enabled: !isETH && !!address && !!swapAndDonateTransaction?.to,
    overrides: {
      gasLimit: BigNumber.from(100_000),
    },
  });
  const { write: erc20Approve } = useContractWrite(config2);

  const requiresAllowance =
    entityAllowance && entityAllowance.lt(amountInParsed);

  const handleTokenChange = (v: any) => {
    setSwapAndDonateTransaction(undefined);
    const newSelectedToken = TOKENS.find(
      (t) => t.contractAddress === v.target.value
    );

    if (!newSelectedToken) return;

    setSelectedToken(newSelectedToken);
    setAmountInParsed(parseUnits(amountIn || '0', newSelectedToken.decimals));
  };

  const handleAmountInChange = (v: string) => {
    if (isNaN(+v)) return;
    setSwapAndDonateTransaction(undefined);

    setAmountIn(v);
    setAmountInParsed(parseUnits(v || '0', selectedToken.decimals));
  };

  const handleApproveAllowance = () => {
    if (requiresAllowance && erc20Approve) erc20Approve();
  };

  const handleGetTransactionData = async () => {
    setLoading(true);

    const tx = await sdk.getDonationSwapTransaction({
      ein,
      tokenContractAddress: selectedToken.contractAddress,
      amountIn: amountInParsed.toString(),
    });
    setSwapAndDonateTransaction(tx);

    setLoading(false);
  };

  const handleSwapAndDonate = async () => {
    if (swapAndDonateTransaction && sendTransaction) sendTransaction();
    else console.error('No deploy transaction or sendTransaction function');
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
              w="100%">
              <NumberInputField placeholder="EIN" />
            </NumberInput>
          </InputGroup>

          <Flex gap="2" w="100%">
            <NumberInput
              flex="3"
              onChange={handleAmountInChange}
              value={amountIn}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleGetTransactionData()
              }>
              <NumberInputField
                placeholder={`Amount in ${selectedToken.symbol} (${selectedToken.decimals} decimals)`}
              />
            </NumberInput>

            <Select
              value={selectedToken.contractAddress}
              onChange={handleTokenChange}
              flex="1">
              {TOKENS.map((token) => (
                <option
                  key={token.contractAddress}
                  value={token.contractAddress}>
                  {token.symbol}
                </option>
              ))}
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
            <Tooltip label="The org's contract address">
              <InfoIcon />
            </Tooltip>{' '}
          </Text>
          <Text ml="4">
            <Text mr="2" display="inline">
              "data": "{`${swapAndDonateTransaction?.data || '0x...'}",`}
            </Text>
            <Tooltip label="The calldata required to swap and donate this token to this org">
              <InfoIcon />
            </Tooltip>{' '}
          </Text>
          <Text ml="4">
            <Text mr="2" display="inline">
              "value": {`${swapAndDonateTransaction?.value || '0'}`}
            </Text>
            <Tooltip label="If swapping ETH/WETH, a ETH value must be sent along. If using ERC20 tokens, this should be 0">
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
                  value={
                    +swapAndDonateTransaction.quote.minimumTolerableUsdc / 1e6
                  }
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

            {requiresAllowance && (
              <Button
                onClick={handleApproveAllowance}
                rightIcon={<ChevronRightIcon />}
                aria-label="Approve Allowance"
                colorScheme="blue">
                Approve Allowance
              </Button>
            )}
            {!requiresAllowance && (
              <Button
                onClick={handleSwapAndDonate}
                rightIcon={<ChevronRightIcon />}
                aria-label="Swap and Donate"
                colorScheme="green">
                Swap & Donate
              </Button>
            )}
          </Flex>
        )}
      </VStack>
    </>
  );
}

export default CharitableGiving;
