
export interface Crypto {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  chainId?: number;
  isNative?: boolean;
}

export interface Transaction {
  id: string;
  fromCrypto: string;
  toCrypto: string;
  amount: string;
  estimatedReceived: string;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
  address: string;
  fromChainId?: number;
  toChainId?: number;
  gasPrice?: string;
  route?: string[];
}

export interface SwapSettings {
  slippageTolerance: number;
  gasSpeed: "slow" | "standard" | "fast";
  customRoute: boolean;
  bridgePreference: "native" | "wrapped";
}

export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
}
