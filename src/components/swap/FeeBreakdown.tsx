
import React from "react";

interface FeeBreakdownProps {
  fees: number;
  cryptoSymbol: string;
}

const FeeBreakdown = ({ fees, cryptoSymbol }: FeeBreakdownProps) => {
  return (
    <div className="space-y-2 p-3 rounded-lg bg-white/5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Network Fee</span>
        <span className="font-mono">{(fees * 0.7).toFixed(6)} {cryptoSymbol}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Service Fee</span>
        <span className="font-mono">{(fees * 0.3).toFixed(6)} {cryptoSymbol}</span>
      </div>
      <div className="flex justify-between text-sm font-medium pt-2 border-t border-white/10">
        <span>Total Fee</span>
        <span className="font-mono">{fees.toFixed(6)} {cryptoSymbol}</span>
      </div>
    </div>
  );
};

export default FeeBreakdown;
