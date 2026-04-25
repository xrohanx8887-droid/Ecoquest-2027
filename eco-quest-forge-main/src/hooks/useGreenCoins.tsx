import { useState, createContext, useContext, ReactNode } from "react";

interface GreenCoinsContextType {
  balance: number;
  earnCoins: (amount: number, reason: string) => void;
  spendCoins: (amount: number, reason: string) => void;
  addTransaction: (transaction: Transaction) => void;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: "earned" | "spent";
  amount: number;
  description: string;
  timestamp: string;
  category: string;
  icon?: any;
}

const GreenCoinsContext = createContext<GreenCoinsContextType | undefined>(
  undefined
);

export const useGreenCoins = () => {
  const context = useContext(GreenCoinsContext);
  if (!context) {
    throw new Error("useGreenCoins must be used within a GreenCoinsProvider");
  }
  return context;
};

interface GreenCoinsProviderProps {
  children: ReactNode;
}

export const GreenCoinsProvider = ({ children }: GreenCoinsProviderProps) => {
  const [balance, setBalance] = useState(500);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "earned",
      amount: 50,
      description: "Quiz on waste management",
      timestamp: "2 hours ago",
      category: "quiz",
    },
    {
      id: "2",
      type: "spent",
      amount: 100,
      description: "Redeemed for canteen discount",
      timestamp: "1 day ago",
      category: "redemption",
    },
    {
      id: "3",
      type: "earned",
      amount: 30,
      description: "Recycling task completed",
      timestamp: "2 days ago",
      category: "mission",
    },
  ]);

  const earnCoins = (amount: number, reason: string) => {
    setBalance((prev) => prev + amount);
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "earned",
      amount,
      description: reason,
      timestamp: "Just now",
      category: "mission",
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const spendCoins = (amount: number, reason: string) => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "spent",
        amount,
        description: reason,
        timestamp: "Just now",
        category: "redemption",
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    }
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  return (
    <GreenCoinsContext.Provider
      value={{
        balance,
        earnCoins,
        spendCoins,
        addTransaction,
        transactions,
      }}
    >
      {children}
    </GreenCoinsContext.Provider>
  );
};

