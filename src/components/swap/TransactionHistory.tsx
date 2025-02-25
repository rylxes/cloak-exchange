
import React from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  fromCrypto: string;
  toCrypto: string;
  amount: string;
  estimatedReceived: string;
  status: TransactionStatus;
  timestamp: Date;
  address: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const StatusIcon = ({ status }: { status: TransactionStatus }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "failed":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
  }
};

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="p-4 rounded-lg bg-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon status={tx.status} />
              <span className="font-medium">
                {tx.fromCrypto} → {tx.toCrypto}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {tx.timestamp.toLocaleString()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Amount</div>
              <div className="font-mono">{tx.amount} {tx.fromCrypto}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Estimated Received</div>
              <div className="font-mono">{tx.estimatedReceived} {tx.toCrypto}</div>
            </div>
          </div>
          
          <div className="text-sm">
            <div className="text-muted-foreground">Recipient</div>
            <div className="font-mono truncate">{tx.address}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
