
import { Shield } from "lucide-react";
import SwapCard from "@/components/SwapCard";
import WalletConnect from "@/components/WalletConnect";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D3436] via-[#000000] to-[#2D3436] py-12 px-4 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[128px] translate-x-1/2 -translate-y-1/2" />
      
      <div className="container max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="flex justify-end mb-6">
          <WalletConnect />
        </div>
        
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 mb-4 hover:bg-white/10 transition-colors">
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Secure & Anonymous</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white/90 to-white/80 text-transparent bg-clip-text">
            Instant Cryptocurrency Swaps
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            Swap cryptocurrencies instantly with complete privacy. No registration required.
          </p>
        </div>

        {/* Swap Interface */}
        <SwapCard />

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              title: "No Registration",
              description: "Start swapping instantly without creating an account",
            },
            {
              title: "Privacy First",
              description: "Your transactions are completely anonymous",
            },
            {
              title: "Instant Swaps",
              description: "Get your coins fast with minimal waiting time",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="glass-card p-8 rounded-xl text-center animate-fade-up group hover:bg-white/10 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-semibold mb-3 text-white/90">{feature.title}</h3>
              <p className="text-white/60 group-hover:text-white/70 transition-colors">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
