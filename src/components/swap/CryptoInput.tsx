
import React from "react";
import CryptoIcon from "../CryptoIcon";

interface CryptoInputProps {
  label: string;
  crypto: { symbol: string; name: string };
  amount?: string;
  cryptos: Array<{ symbol: string; name: string }>;
  onCryptoChange: (crypto: { symbol: string; name: string }) => void;
  onAmountChange?: (amount: string) => void;
  isValid?: boolean;
  readonly?: boolean;
  estimatedAmount?: string;
}

const CryptoInput = ({
  label,
  crypto,
  amount,
  cryptos,
  onCryptoChange,
  onAmountChange,
  isValid = true,
  readonly = false,
  estimatedAmount,
}: CryptoInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-3 p-3 rounded-lg input-glass">
        <CryptoIcon symbol={crypto.symbol} />
        <select
          value={crypto.symbol}
          onChange={(e) => onCryptoChange(cryptos.find(c => c.symbol === e.target.value) || cryptos[0])}
          className="bg-transparent flex-1 outline-none"
        >
          {cryptos.map(crypto => (
            <option key={crypto.symbol} value={crypto.symbol}>
              {crypto.name}
            </option>
          ))}
        </select>
        {readonly ? (
          <span className="font-mono text-muted-foreground">≈ {estimatedAmount}</span>
        ) : (
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            placeholder="0.00"
            className={`bg-transparent text-right outline-none font-mono ${
              !isValid && amount ? "text-destructive" : ""
            }`}
          />
        )}
      </div>
      {!isValid && amount && (
        <p className="text-xs text-destructive">Please enter a valid amount (0-100)</p>
      )}
    </div>
  );
};

export default CryptoInput;
