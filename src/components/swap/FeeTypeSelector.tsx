
import React from "react";

interface FeeTypeSelectorProps {
  feeType: "fixed" | "dynamic";
  onFeeTypeChange: (type: "fixed" | "dynamic") => void;
}

const FeeTypeSelector = ({ feeType, onFeeTypeChange }: FeeTypeSelectorProps) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onFeeTypeChange("fixed")}
        className={`flex-1 p-4 rounded-lg transition-all duration-200 ${
          feeType === "fixed" 
            ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25" 
            : "bg-white/5 hover:bg-white/10 text-white/80"
        }`}
      >
        <div className="text-sm font-medium mb-1">Fixed Rate</div>
        <div className="text-xs opacity-80">1% guaranteed rate</div>
      </button>
      <button
        onClick={() => onFeeTypeChange("dynamic")}
        className={`flex-1 p-4 rounded-lg transition-all duration-200 ${
          feeType === "dynamic" 
            ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25" 
            : "bg-white/5 hover:bg-white/10 text-white/80"
        }`}
      >
        <div className="text-sm font-medium mb-1">Dynamic Rate</div>
        <div className="text-xs opacity-80">~0.5% market rate</div>
      </button>
    </div>
  );
};

export default FeeTypeSelector;
