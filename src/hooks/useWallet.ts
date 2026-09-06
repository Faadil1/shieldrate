import { useCallback, useState } from "react";
import type { WalletState } from "../types";
import { displayAddress } from "../data";

const MOCK_ADDR = "0x7a3f8b2c9de14f7a2b8c6e1d5f4a9c3b";

interface UseWalletReturn {
  wallet: WalletState;
  connect: () => Promise<WalletState>;
  disconnect: () => void;
  connecting: boolean;
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    displayAddress: "Not connected",
    network: "none",
  });
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async (): Promise<WalletState> => {
    setConnecting(true);
    try {
      // Lace / MidnightJS wallet bridge.
      // In production this calls `wallet.connect()` from the MidnightJS SDK.
      await new Promise((r) => setTimeout(r, 900));
      const next: WalletState = {
        connected: true,
        address: MOCK_ADDR,
        displayAddress: displayAddress(MOCK_ADDR),
        network: "preprod",
      };
      setWallet(next);
      return next;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      connected: false,
      address: null,
      displayAddress: "Not connected",
      network: "none",
    });
  }, []);

  return { wallet, connect, disconnect, connecting };
}