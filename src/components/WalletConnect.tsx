
import React, { useState, useEffect } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WalletConnect = () => {
  const [address, setAddress] = useState<string>("");
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
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
      
      setAddress(address);
      setSigner(signer);
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
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
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
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
          });
        }
      });
    }
  }, []);

  if (address) {
    return (
      <button
        onClick={disconnectWallet}
        className="glass-card px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
      >
        <Wallet className="w-4 h-4" />
        <span className="font-mono text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </button>
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
