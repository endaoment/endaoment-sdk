export type Token = {
  symbol: string;
  decimals: number;
  contractAddress: string;
};

export const TOKENS_MAINNET: Token[] = [
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

export const TOKENS_GOERLI: Token[] = [
  {
    symbol: 'ETH',
    decimals: 18,
    contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    symbol: 'WETH',
    decimals: 18,
    contractAddress: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  },
  {
    symbol: 'USDC',
    decimals: 6,
    contractAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  },
  {
    symbol: 'DAI',
    decimals: 18,
    contractAddress: '0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844',
  },
];
