import { useCallback, useState } from "react";
import type { WalletState } from "../types";
import { displayAddress } from "../data";
import { executionMode } from "../security/integrity";
import { getMidnightLiveConfig } from "../midnight/config";
import {
  clearMidnightWalletSession,
  connectMidnightWallet,
} from "../midnight/wallet";

const DEMO_ADDR = "demo-wallet-7a3f8b2c9de14f7a";

interface UseWalletReturn {
  wallet: WalletState;
  connect: () => Promise<WalletState>;
  disconnect: () => void;
  connecting: boolean;
}

const disconnected = (): WalletState => ({
  connected: false,
  address: null,
  displayAddress: "Not connected",
  network: "none",
});

const networkLabel = (networkId: string): WalletState["network"] => {
  const normalized = networkId.toLowerCase();
  if (normalized.includes("preprod")) return "preprod";
  if (normalized.includes("preview")) return "preview";
  if (normalized.includes("dev")) return "devnet";
  return "none";
};

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletState>(disconnected);
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async (): Promise<WalletState> => {
    setConnecting(true);
    try {
      if (executionMode() === "midnight-live") {
        const config = getMidnightLiveConfig();
        const session = await connectMidnightWallet(config.networkId);
        const next: WalletState = {
          connected: true,
          address: session.shieldedAddress,
          displayAddress: displayAddress(session.shieldedAddress),
          network: networkLabel(String(session.networkId)),
        };
        setWallet(next);
        return next;
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
    clearMidnightWalletSession();
    setWallet(disconnected());
  }, []);

  return { wallet, connect, disconnect, connecting };
}
