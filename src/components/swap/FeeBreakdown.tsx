
import React from "react";

interface FeeBreakdownProps {
  fees: number;
  cryptoSymbol: string;
}

const FeeBreakdown = ({ fees, cryptoSymbol }: FeeBreakdownProps) => {
  return (
    <div className="space-y-2 p-4 rounded-lg bg-gray-50 border border-black/5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Network Fee</span>
        <span className="font-mono text-gray-800">{(fees * 0.7).toFixed(6)} {cryptoSymbol}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Service Fee</span>
        <span className="font-mono text-gray-800">{(fees * 0.3).toFixed(6)} {cryptoSymbol}</span>
      </div>
      <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
        <span className="text-gray-900">Total Fee</span>
        <span className="font-mono text-gray-900">{fees.toFixed(6)} {cryptoSymbol}</span>
      </div>
    </div>
  );
};

export default FeeBreakdown;
