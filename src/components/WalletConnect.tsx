
import React, { useState, useEffect } from "react";
import { BrowserProvider, JsonRpcSigner, Network } from "ethers";
import { Wallet, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SUPPORTED_NETWORKS = {
  1: "Ethereum Mainnet",
  5: "Goerli Testnet",
  11155111: "Sepolia",
  137: "Polygon Mainnet",
  80001: "Mumbai Testnet",
};

const WalletConnect = () => {
  const [address, setAddress] = useState<string>("");
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask browser extension",
          variant: "destructive",
        });
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      setAddress(address);
      setSigner(signer);
      setNetwork(network);
      
      // Check if connected to supported network
      const chainId = Number(network.chainId);
      setIsWrongNetwork(!SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS]);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS] || network.name}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setAddress("");
    setSigner(null);
    setNetwork(null);
    setIsWrongNetwork(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const handleNetworkChange = async () => {
    if (!window.ethereum) return;
    
    try {
      // Request network switch to Ethereum Mainnet
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }], // Ethereum Mainnet
      });
    } catch (error: any) {
      if (error.code === 4902) {
        toast({
          title: "Network not found",
          description: "Please add the network to your wallet first",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      provider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          provider.getSigner().then((signer) => {
            setSigner(signer);
            signer.getAddress().then(setAddress);
            provider.getNetwork().then((network) => {
              setNetwork(network);
              const chainId = Number(network.chainId);
              setIsWrongNetwork(!SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS]);
            });
          });
        }
      });

      // Listen for network changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          window.location.reload();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", () => {});
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  if (address && isWrongNetwork) {
    return (
      <button
        onClick={handleNetworkChange}
        className="glass-card px-4 py-2 rounded-full flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 transition-colors"
      >
        <AlertCircle className="w-4 h-4 text-destructive" />
        <span className="text-sm text-destructive">Switch Network</span>
      </button>
    );
  }

  if (address) {
    return (
      <div className="flex items-center gap-2">
        {network && (
          <span className="text-sm text-muted-foreground">
            {SUPPORTED_NETWORKS[Number(network.chainId) as keyof typeof SUPPORTED_NETWORKS] || network.name}
          </span>
        )}
        <button
          onClick={disconnectWallet}
          className="glass-card px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
        >
          <Wallet className="w-4 h-4" />
          <span className="font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="glass-card px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
    >
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </button>
  );
};

export default WalletConnect;
