
import { useState, useEffect } from "react";

export const useExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,monero,binancecoin&vs_currencies=usd'
        );
        const data = await response.json();
        setExchangeRates({
          BTC: data.bitcoin?.usd || 0,
          ETH: data.ethereum?.usd || 0,
          SOL: data.solana?.usd || 0,
          XMR: data.monero?.usd || 0,
          BNB: data.binancecoin?.usd || 0,
        });
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 60000);
    return () => clearInterval(interval);
  }, []);

  return exchangeRates;
};
