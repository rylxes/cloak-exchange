
import { Crypto } from "@/types/crypto";

export const cryptos: Crypto[] = [
  { symbol: "BTC", name: "Bitcoin", decimals: 8, address: "0x..." },
  { symbol: "ETH", name: "Ethereum", decimals: 18, address: "0x..." },
  { symbol: "SOL", name: "Solana", decimals: 9, address: "0x..." },
  { symbol: "XMR", name: "Monero", decimals: 12, address: "0x..." },
  { symbol: "BNB", name: "Binance Coin", decimals: 18, address: "0x..." },
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
