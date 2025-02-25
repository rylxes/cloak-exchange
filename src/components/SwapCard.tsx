import React, { useState } from "react";
import CryptoIcon from "./CryptoIcon";
import { ArrowDownUp, Shield, Eye, EyeOff } from "lucide-react";
import { generateStealthAddress, getPrivacyLevel, getSuggestedMixers } from "@/utils/privacyUtils";
import { useToast } from "@/hooks/use-toast";

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
    const isValid = !isNaN(numValue) && numValue > 0 && numValue <= 100; // Example max limit
    setIsValidAmount(isValid);
    return isValid;
  };

  const validateAddress = (value: string) => {
    // Basic validation - in a real app, this would be more sophisticated
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
      
      {/* From Crypto */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium">From</label>
        <div className="flex items-center space-x-3 p-3 rounded-lg input-glass">
          <CryptoIcon symbol={fromCrypto.symbol} />
          <select 
            value={fromCrypto.symbol}
            onChange={(e) => setFromCrypto(cryptos.find(c => c.symbol === e.target.value) || cryptos[0])}
            className="bg-transparent flex-1 outline-none"
          >
            {cryptos.map(crypto => (
              <option key={crypto.symbol} value={crypto.symbol}>
                {crypto.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              validateAmount(e.target.value);
            }}
            placeholder="0.00"
            className={`bg-transparent text-right outline-none font-mono ${
              !isValidAmount && amount ? "text-destructive" : ""
            }`}
          />
        </div>
        {!isValidAmount && amount && (
          <p className="text-xs text-destructive">Please enter a valid amount (0-100)</p>
        )}
      </div>

      {/* Swap Direction Button */}
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

      {/* To Crypto */}
      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium">To</label>
        <div className="flex items-center space-x-3 p-3 rounded-lg input-glass">
          <CryptoIcon symbol={toCrypto.symbol} />
          <select
            value={toCrypto.symbol}
            onChange={(e) => setToCrypto(cryptos.find(c => c.symbol === e.target.value) || cryptos[1])}
            className="bg-transparent flex-1 outline-none"
          >
            {cryptos.map(crypto => (
              <option key={crypto.symbol} value={crypto.symbol}>
                {crypto.name}
              </option>
            ))}
          </select>
          <span className="font-mono text-muted-foreground">≈ {estimatedAmount}</span>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-2 mb-6 p-3 rounded-lg bg-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <span className="font-medium">Privacy Mode</span>
          </div>
          <button
            onClick={() => setStealthMode(!stealthMode)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {stealthMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        
        {stealthMode && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Privacy Level</span>
              <span className={`font-medium ${
                privacyLevel === 'high' ? 'text-green-500' :
                privacyLevel === 'medium' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {privacyLevel.charAt(0).toUpperCase() + privacyLevel.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mixer Count</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMixerCount(Math.max(1, mixerCount - 1))}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >-</button>
                <span className="w-8 text-center">{mixerCount}</span>
                <button
                  onClick={() => setMixerCount(Math.min(10, mixerCount + 1))}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >+</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fee Breakdown */}
      <div className="space-y-2 mb-6 p-3 rounded-lg bg-white/5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Network Fee</span>
          <span className="font-mono">{(fees * 0.7).toFixed(6)} {fromCrypto.symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service Fee</span>
          <span className="font-mono">{(fees * 0.3).toFixed(6)} {fromCrypto.symbol}</span>
        </div>
        <div className="flex justify-between text-sm font-medium pt-2 border-t border-white/10">
          <span>Total Fee</span>
          <span className="font-mono">{fees.toFixed(6)} {fromCrypto.symbol}</span>
        </div>
      </div>

      {/* Recipient Address */}
      <div className="space-y-2 mb-6">
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

      {/* Fee Type Selection */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFeeType("fixed")}
          className={`flex-1 p-3 rounded-lg transition-colors ${
            feeType === "fixed" 
              ? "bg-accent text-accent-foreground" 
              : "bg-white/5 hover:bg-white/10"
          }`}
        >
          Fixed Rate (1%)
        </button>
        <button
          onClick={() => setFeeType("dynamic")}
          className={`flex-1 p-3 rounded-lg transition-colors ${
            feeType === "dynamic" 
              ? "bg-accent text-accent-foreground" 
              : "bg-white/5 hover:bg-white/10"
          }`}
        >
          Dynamic Rate (~0.5%)
        </button>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!isValidAmount || !isValidAddress || !amount || !address}
        className="w-full p-4 rounded-lg bg-accent text-accent-foreground font-medium hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Swap Now
      </button>
    </div>
  );
};

export default SwapCard;
