import { useCallback, useState } from "react";
import type { WalletState } from "../types";
import { displayAddress } from "../data";
import { executionMode } from "../security/integrity";

const DEMO_ADDR = "demo-wallet-7a3f8b2c9de14f7a";

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
      if (executionMode() === "midnight-live") {
        throw new Error(
          "MIDNIGHT_LIVE is fail-closed until the Lace/MidnightJS wallet adapter is wired",
        );
      }
      const next: WalletState = {
        connected: true,
        address: DEMO_ADDR,
        displayAddress: displayAddress(DEMO_ADDR),
        network: "none",
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
