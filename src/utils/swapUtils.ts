import { Crypto } from "@/types/crypto";

export const cryptos: Crypto[] = [
  { 
    symbol: "ETH", 
    name: "Ethereum", 
    decimals: 18, 
    address: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    isNative: true
  },
  { 
    symbol: "MATIC", 
    name: "Polygon", 
    decimals: 18, 
    address: "0x0000000000000000000000000000000000000000",
    chainId: 137,
    isNative: true
  },
  { 
    symbol: "BNB", 
    name: "Binance Coin", 
    decimals: 18, 
    address: "0x0000000000000000000000000000000000000000",
    chainId: 56,
    isNative: true
  },
  { 
    symbol: "WETH", 
    name: "Wrapped Ethereum", 
    decimals: 18, 
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    chainId: 1
  },
  { 
    symbol: "WMATIC", 
    name: "Wrapped MATIC", 
    decimals: 18, 
    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    chainId: 137
  },
  { 
    symbol: "WBNB", 
    name: "Wrapped BNB", 
    decimals: 18, 
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    chainId: 56
  }
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
];

export const calculateExchangeRate = (
  from: string,
  to: string,
  amount: string,
  exchangeRates: Record<string, number>
): string => {
  if (!amount || isNaN(Number(amount))) return "0.00";
  const fromRate = exchangeRates[from] || 0;
  const toRate = exchangeRates[to] || 0;
  if (fromRate && toRate) {
    return ((Number(amount) * fromRate) / toRate).toFixed(6);
  }
  return "0.00";
};

export const validateAmount = (value: string): boolean => {
  const numValue = Number(value);
  return !isNaN(numValue) && numValue > 0 && numValue <= 100;
};

export const validateAddress = (value: string): boolean => {
  return value.length >= 26 && value.length <= 42;
};

export const calculateFees = (
  amount: string,
  feeType: "fixed" | "dynamic",
  stealthMode: boolean,
  mixerCount: number
): number => {
  if (!amount || isNaN(Number(amount))) return 0;
  const baseAmount = Number(amount);
  const baseFee = feeType === "fixed" ? baseAmount * 0.01 : baseAmount * 0.005;
  const privacyFee = stealthMode ? baseFee * (mixerCount * 0.001) : 0;
  return baseFee + privacyFee;
};
