
import React from "react";

interface FeeBreakdownProps {
  fees: number;
  cryptoSymbol: string;
}

const FeeBreakdown = ({ fees, cryptoSymbol }: FeeBreakdownProps) => {
  return (
    <div className="space-y-2 p-4 rounded-lg bg-white/5 border border-white/5">
      <div className="flex justify-between text-sm">
        <span className="text-white/60">Network Fee</span>
        <span className="font-mono text-white/80">{(fees * 0.7).toFixed(6)} {cryptoSymbol}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-white/60">Service Fee</span>
        <span className="font-mono text-white/80">{(fees * 0.3).toFixed(6)} {cryptoSymbol}</span>
      </div>
      <div className="flex justify-between text-sm font-medium pt-2 border-t border-white/10">
        <span className="text-white/90">Total Fee</span>
        <span className="font-mono text-white">{fees.toFixed(6)} {cryptoSymbol}</span>
      </div>
    </div>
  );
};

export default FeeBreakdown;
