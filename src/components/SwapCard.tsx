
import React, { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { generateStealthAddress, getPrivacyLevel } from "@/utils/privacyUtils";
import { useToast } from "@/hooks/use-toast";
import CryptoInput from "./swap/CryptoInput";
import PrivacySettings from "./swap/PrivacySettings";
import FeeBreakdown from "./swap/FeeBreakdown";
import FeeTypeSelector from "./swap/FeeTypeSelector";

const cryptos = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "XMR", name: "Monero" },
  { symbol: "BNB", name: "Binance Coin" },
];

const mockExchangeRates: Record<string, Record<string, number>> = {
  BTC: { ETH: 13.5, SOL: 1150, XMR: 185, BNB: 98 },
  ETH: { BTC: 0.074, SOL: 85, XMR: 13.7, BNB: 7.25 },
  SOL: { BTC: 0.00087, ETH: 0.0118, XMR: 0.161, BNB: 0.085 },
  XMR: { BTC: 0.0054, ETH: 0.073, SOL: 6.21, BNB: 0.53 },
  BNB: { BTC: 0.0102, ETH: 0.138, SOL: 11.76, XMR: 1.89 },
};

const SwapCard = () => {
  const [fromCrypto, setFromCrypto] = useState(cryptos[0]);
  const [toCrypto, setToCrypto] = useState(cryptos[1]);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [feeType, setFeeType] = useState<"fixed" | "dynamic">("fixed");
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);
  const [mixerCount, setMixerCount] = useState(3);
  const { toast } = useToast();

  const calculateExchangeRate = (from: string, to: string, amount: string): string => {
    if (!amount || isNaN(Number(amount))) return "0.00";
    const rate = mockExchangeRates[from][to] || 1/mockExchangeRates[to][from];
    return (Number(amount) * rate).toFixed(6);
  };

  const validateAmount = (value: string) => {
    const numValue = Number(value);
    const isValid = !isNaN(numValue) && numValue > 0 && numValue <= 100;
    setIsValidAmount(isValid);
    return isValid;
  };

  const validateAddress = (value: string) => {
    const isValid = value.length >= 26 && value.length <= 42;
    setIsValidAddress(isValid);
    return isValid;
  };

  const calculateFees = () => {
    if (!amount || isNaN(Number(amount))) return 0;
    const baseAmount = Number(amount);
    const baseFee = feeType === "fixed" ? baseAmount * 0.01 : baseAmount * 0.005;
    const privacyFee = stealthMode ? baseFee * (mixerCount * 0.001) : 0;
    return baseFee + privacyFee;
  };

  const handleSwap = () => {
    if (!validateAmount(amount) || !validateAddress(address)) {
      return;
    }

    const exchangeAmount = calculateExchangeRate(fromCrypto.symbol, toCrypto.symbol, amount);
    const fees = calculateFees();
    const finalAddress = stealthMode ? generateStealthAddress(address) : address;
    const privacyLevel = getPrivacyLevel(Number(amount));

    console.log("Swapping:", {
      from: fromCrypto.symbol,
      to: toCrypto.symbol,
      amount,
      exchangeAmount,
      fees,
      address: finalAddress,
      feeType,
      stealthMode,
      mixerCount,
      privacyLevel,
    });

    toast({
      title: "Swap Initiated",
      description: `Transaction will be routed through ${mixerCount} mixer${mixerCount > 1 ? 's' : ''} for enhanced privacy.`,
    });
  };

  const estimatedAmount = calculateExchangeRate(fromCrypto.symbol, toCrypto.symbol, amount);
  const fees = calculateFees();
  const privacyLevel = amount ? getPrivacyLevel(Number(amount)) : 'low';

  return (
    <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-auto animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Swap Cryptocurrencies</h2>
      
      <div className="space-y-4">
        <CryptoInput
          label="From"
          crypto={fromCrypto}
          amount={amount}
          cryptos={cryptos}
          onCryptoChange={setFromCrypto}
          onAmountChange={(value) => {
            setAmount(value);
            validateAmount(value);
          }}
          isValid={isValidAmount}
        />

        <button 
          onClick={() => {
            const temp = fromCrypto;
            setFromCrypto(toCrypto);
            setToCrypto(temp);
          }}
          className="mx-auto block p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <ArrowDownUp className="text-accent" />
        </button>

        <CryptoInput
          label="To"
          crypto={toCrypto}
          cryptos={cryptos}
          onCryptoChange={setToCrypto}
          readonly
          estimatedAmount={estimatedAmount}
        />

        <PrivacySettings
          stealthMode={stealthMode}
          onStealthModeChange={setStealthMode}
          mixerCount={mixerCount}
          onMixerCountChange={setMixerCount}
          privacyLevel={privacyLevel}
        />

        <FeeBreakdown
          fees={fees}
          cryptoSymbol={fromCrypto.symbol}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Recipient Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              validateAddress(e.target.value);
            }}
            placeholder={`Enter ${toCrypto.name} Address`}
            className={`w-full p-3 rounded-lg input-glass font-mono text-sm ${
              !isValidAddress && address ? "border border-destructive" : ""
            }`}
          />
          {!isValidAddress && address && (
            <p className="text-xs text-destructive">Please enter a valid wallet address</p>
          )}
        </div>

        <FeeTypeSelector
          feeType={feeType}
          onFeeTypeChange={setFeeType}
        />

        <button
          onClick={handleSwap}
          disabled={!isValidAmount || !isValidAddress || !amount || !address}
          className="w-full p-4 rounded-lg bg-accent text-accent-foreground font-medium hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Swap Now
        </button>
      </div>
    </div>
  );
};

export default SwapCard;
