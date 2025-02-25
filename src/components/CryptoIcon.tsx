
import { Bitcoin, CircleDollarSign } from "lucide-react";
import React from "react";

type CryptoIconProps = {
  symbol: string;
  size?: number;
};

const CryptoIcon: React.FC<CryptoIconProps> = ({ symbol, size = 24 }) => {
  switch (symbol.toLowerCase()) {
    case "btc":
      return <Bitcoin size={size} className="text-[#F7931A]" />;
    case "eth":
      return <CircleDollarSign size={size} className="text-[#627EEA]" />;
    // Add other crypto icons as needed
    default:
      return <div className="w-6 h-6 rounded-full bg-gray-200" />;
  }
};

export default CryptoIcon;
