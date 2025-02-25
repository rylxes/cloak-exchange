import React, { useState } from "react";
import { ArrowDownUp, History } from "lucide-react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { generateStealthAddress, getPrivacyLevel } from "@/utils/privacyUtils";
import { useToast } from "@/hooks/use-toast";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { Crypto, Transaction, SwapSettings } from "@/types/crypto";
import { networks, supportsCrossChain } from "@/config/networks";
import { 
  cryptos,
  ERC20_ABI,
  calculateExchangeRate,
  validateAmount,
  validateAddress,
  calculateFees 
} from "@/utils/swapUtils";
import CryptoInput from "./swap/CryptoInput";
import PrivacySettings from "./swap/PrivacySettings";
import FeeBreakdown from "./swap/FeeBreakdown";
import FeeTypeSelector from "./swap/FeeTypeSelector";
import TransactionHistory from "./swap/TransactionHistory";
import AdvancedSettings from "./swap/AdvancedSettings";

const SwapCard = () => {
  const [fromCrypto, setFromCrypto] = useState<Crypto>(cryptos[0]);
  const [toCrypto, setToCrypto] = useState<Crypto>(cryptos[1]);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [feeType, setFeeType] = useState<"fixed" | "dynamic">("fixed");
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);
  const [mixerCount, setMixerCount] = useState(3);
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [swapSettings, setSwapSettings] = useState<SwapSettings>({
    slippageTolerance: 0.5,
    gasSpeed: "standard",
    customRoute: false,
    bridgePreference: "native",
  });

  const exchangeRates = useExchangeRates();
  const { toast } = useToast();

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
      const requiredAmount = parseUnits(amount, 18);

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

  const handleNetworkChange = async (chainId: number) => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        const network = networks.find(n => n.chainId === chainId);
        if (!network) return;
        
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: network.name,
              nativeCurrency: network.nativeCurrency,
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.explorerUrl],
            },
          ],
        });
      }
    }
  };

  const isCrossChainSwap = () => {
    const fromChainId = fromCrypto.chainId;
    const toChainId = toCrypto.chainId;
    return fromChainId && toChainId && fromChainId !== toChainId;
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
      if (fromCrypto.chainId) {
        await handleNetworkChange(fromCrypto.chainId);
      }

      const isApproved = await checkAndApproveToken(fromCrypto.address, amount);
      if (!isApproved) return;

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const exchangeAmount = calculateExchangeRate(
        fromCrypto.symbol,
        toCrypto.symbol,
        amount,
        exchangeRates
      );

      const minReceived = Number(exchangeAmount) * (1 - swapSettings.slippageTolerance / 100);

      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        fromCrypto: fromCrypto.symbol,
        toCrypto: toCrypto.symbol,
        amount,
        estimatedReceived: exchangeAmount,
        status: "pending",
        timestamp: new Date(),
        address: stealthMode ? generateStealthAddress(address) : address,
        fromChainId: fromCrypto.chainId,
        toChainId: toCrypto.chainId,
      };

      setTransactions(prev => [newTransaction, ...prev]);

      if (isCrossChainSwap()) {
        toast({
          title: "Cross-Chain Swap Initiated",
          description: `Bridging ${amount} ${fromCrypto.symbol} to ${toCrypto.symbol} network`,
        });
      }

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

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setIsValidAmount(validateAmount(value));
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setIsValidAddress(validateAddress(value));
  };

  return (
    <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Swap Cryptocurrencies</h2>
        <div className="flex items-center gap-2">
          <AdvancedSettings
            settings={swapSettings}
            onSettingsChange={setSwapSettings}
          />
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
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
            onAmountChange={handleAmountChange}
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
            estimatedAmount={calculateExchangeRate(
              fromCrypto.symbol,
              toCrypto.symbol,
              amount,
              exchangeRates
            )}
          />

          <PrivacySettings
            stealthMode={stealthMode}
            onStealthModeChange={setStealthMode}
            mixerCount={mixerCount}
            onMixerCountChange={setMixerCount}
            privacyLevel={getPrivacyLevel(Number(amount))}
          />

          <FeeBreakdown
            fees={calculateFees(amount, feeType, stealthMode, mixerCount)}
            cryptoSymbol={fromCrypto.symbol}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
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
