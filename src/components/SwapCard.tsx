import React, { useState, useEffect } from "react";
import { ArrowDownUp, History } from "lucide-react";
import { BrowserProvider, Contract, parseUnits, formatUnits } from "ethers";
import { generateStealthAddress, getPrivacyLevel } from "@/utils/privacyUtils";
import { useToast } from "@/hooks/use-toast";
import CryptoInput from "./swap/CryptoInput";
import PrivacySettings from "./swap/PrivacySettings";
import FeeBreakdown from "./swap/FeeBreakdown";
import FeeTypeSelector from "./swap/FeeTypeSelector";
import TransactionHistory, { Transaction } from "./swap/TransactionHistory";

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
];

const cryptos = [
  { symbol: "BTC", name: "Bitcoin", decimals: 8, address: "0x..." },
  { symbol: "ETH", name: "Ethereum", decimals: 18, address: "0x..." },
  { symbol: "SOL", name: "Solana", decimals: 9, address: "0x..." },
  { symbol: "XMR", name: "Monero", decimals: 12, address: "0x..." },
  { symbol: "BNB", name: "Binance Coin", decimals: 18, address: "0x..." },
];

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
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,monero,binancecoin&vs_currencies=usd');
        const data = await response.json();
        setExchangeRates({
          BTC: data.bitcoin?.usd || 0,
          ETH: data.ethereum?.usd || 0,
          SOL: data.solana?.usd || 0,
          XMR: data.monero?.usd || 0,
          BNB: data.binancecoin?.usd || 0,
        });
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const calculateExchangeRate = (from: string, to: string, amount: string): string => {
    if (!amount || isNaN(Number(amount))) return "0.00";
    const fromRate = exchangeRates[from] || 0;
    const toRate = exchangeRates[to] || 0;
    if (fromRate && toRate) {
      return ((Number(amount) * fromRate) / toRate).toFixed(6);
    }
    return "0.00";
  };

  const checkAndApproveToken = async (tokenAddress: string, amount: string) => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask to proceed with the swap",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsApproving(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(tokenAddress, ERC20_ABI, signer);
      
      const spenderAddress = "0x..." // Your DEX contract address
      const currentAllowance = await contract.allowance(await signer.getAddress(), spenderAddress);
      const requiredAmount = parseUnits(amount, 18); // Adjust decimals based on token

      if (currentAllowance < requiredAmount) {
        const tx = await contract.approve(spenderAddress, requiredAmount);
        await tx.wait();
        
        toast({
          title: "Approval Successful",
          description: "Token approval confirmed",
        });
      }
      
      return true;
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve token spending",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  const handleSwap = async () => {
    if (!validateAmount(amount) || !validateAddress(address)) {
      return;
    }

    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask to proceed with the swap",
        variant: "destructive",
      });
      return;
    }

    try {
      const isApproved = await checkAndApproveToken(fromCrypto.address, amount);
      if (!isApproved) return;

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const exchangeAmount = calculateExchangeRate(fromCrypto.symbol, toCrypto.symbol, amount);
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        fromCrypto: fromCrypto.symbol,
        toCrypto: toCrypto.symbol,
        amount,
        estimatedReceived: exchangeAmount,
        status: "pending",
        timestamp: new Date(),
        address: stealthMode ? generateStealthAddress(address) : address,
      };

      setTransactions(prev => [newTransaction, ...prev]);

      setTimeout(() => {
        setTransactions(prev => 
          prev.map(tx => 
            tx.id === newTransaction.id 
              ? { ...tx, status: "completed" }
              : tx
          )
        );
        
        toast({
          title: "Swap Completed",
          description: `Successfully swapped ${amount} ${fromCrypto.symbol} to ${exchangeAmount} ${toCrypto.symbol}`,
        });
      }, 2000);

      setAmount("");
      setAddress("");
    } catch (error) {
      console.error("Swap error:", error);
      toast({
        title: "Swap Failed",
        description: "Failed to complete the swap transaction",
        variant: "destructive",
      });
    }
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

  const estimatedAmount = calculateExchangeRate(fromCrypto.symbol, toCrypto.symbol, amount);
  const fees = calculateFees();
  const privacyLevel = amount ? getPrivacyLevel(Number(amount)) : 'low';

  return (
    <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Swap Cryptocurrencies</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      {showHistory ? (
        <TransactionHistory transactions={transactions} />
      ) : (
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
            estimatedAmount={calculateExchangeRate(fromCrypto.symbol, toCrypto.symbol, amount)}
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
            disabled={!isValidAmount || !isValidAddress || !amount || !address || isApproving}
            className="w-full p-4 rounded-lg bg-accent text-accent-foreground font-medium hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving ? "Approving..." : "Swap Now"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SwapCard;
