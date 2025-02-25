
import React, { useState } from "react";
import CryptoIcon from "./CryptoIcon";
import { ArrowDownUp } from "lucide-react";

const cryptos = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  // Add other cryptocurrencies
];

const SwapCard = () => {
  const [fromCrypto, setFromCrypto] = useState(cryptos[0]);
  const [toCrypto, setToCrypto] = useState(cryptos[1]);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [feeType, setFeeType] = useState<"fixed" | "dynamic">("fixed");

  const handleSwap = () => {
    // Implement swap logic
    console.log("Swapping:", { fromCrypto, toCrypto, amount, address, feeType });
  };

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
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="bg-transparent text-right outline-none font-mono"
          />
        </div>
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
          <span className="font-mono text-muted-foreground">≈ 0.00</span>
        </div>
      </div>

      {/* Recipient Address */}
      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium">Recipient Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={`Enter ${toCrypto.name} Address`}
          className="w-full p-3 rounded-lg input-glass font-mono text-sm"
        />
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
        className="w-full p-4 rounded-lg bg-accent text-accent-foreground font-medium hover-scale"
      >
        Swap Now
      </button>
    </div>
  );
};

export default SwapCard;
