
import { Shield } from "lucide-react";
import SwapCard from "@/components/SwapCard";
import WalletConnect from "@/components/WalletConnect";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC] py-12 px-4 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[128px] translate-x-1/2 -translate-y-1/2" />
      
      <div className="container max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="flex justify-end mb-6">
          <WalletConnect />
        </div>
        
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 text-gray-800 mb-4 hover:bg-white/90 transition-colors shadow-sm">
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Secure & Anonymous</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-transparent bg-clip-text">
            Instant Cryptocurrency Swaps
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
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
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl text-center animate-fade-up group hover:bg-white/90 transition-all duration-300 border border-black/5 shadow-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
