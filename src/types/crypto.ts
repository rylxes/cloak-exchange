
export interface Crypto {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
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
}
