
import { Network } from "@/types/crypto";

export const networks: Network[] = [
  {
    chainId: 1,
    name: "Ethereum",
    rpcUrl: "https://mainnet.infura.io/v3/your-api-key",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: {
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    chainId: 137,
    name: "Polygon",
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: {
      symbol: "MATIC",
      decimals: 18,
    },
  },
  {
    chainId: 56,
    name: "BNB Chain",
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com",
    nativeCurrency: {
      symbol: "BNB",
      decimals: 18,
    },
  },
];

export const getNetwork = (chainId: number): Network | undefined => {
  return networks.find((network) => network.chainId === chainId);
};

export const supportsCrossChain = (fromChainId: number, toChainId: number): boolean => {
  return fromChainId !== toChainId && networks.some(n => n.chainId === fromChainId) && networks.some(n => n.chainId === toChainId);
};
