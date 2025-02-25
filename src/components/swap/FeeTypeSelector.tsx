
import React from "react";

interface FeeTypeSelectorProps {
  feeType: "fixed" | "dynamic";
  onFeeTypeChange: (type: "fixed" | "dynamic") => void;
}

const FeeTypeSelector = ({ feeType, onFeeTypeChange }: FeeTypeSelectorProps) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onFeeTypeChange("fixed")}
        className={`flex-1 p-3 rounded-lg transition-colors ${
          feeType === "fixed" 
            ? "bg-accent text-accent-foreground" 
            : "bg-white/5 hover:bg-white/10"
        }`}
      >
        Fixed Rate (1%)
      </button>
      <button
        onClick={() => onFeeTypeChange("dynamic")}
        className={`flex-1 p-3 rounded-lg transition-colors ${
          feeType === "dynamic" 
            ? "bg-accent text-accent-foreground" 
            : "bg-white/5 hover:bg-white/10"
        }`}
      >
        Dynamic Rate (~0.5%)
      </button>
    </div>
  );
};

export default FeeTypeSelector;
