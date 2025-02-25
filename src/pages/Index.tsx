
import { Shield } from "lucide-react";
import SwapCard from "@/components/SwapCard";
import WalletConnect from "@/components/WalletConnect";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-end mb-6">
          <WalletConnect />
        </div>
        
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Secure & Anonymous</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Instant Cryptocurrency Swaps
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
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
              className="glass-card p-6 rounded-xl text-center animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
