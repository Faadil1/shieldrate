import { useCallback, useState } from "react";
import type { MidnightNetwork, WalletState } from "../types";
import { displayAddress } from "../data";
import { executionMode } from "../security/integrity";
import { connectMidnightRuntime } from "../midnight/runtime";

const DEMO_ADDR = "demo-wallet-7a3f8b2c9de14f7a";

interface UseWalletReturn {
  wallet: WalletState;
  connect: () => Promise<WalletState>;
  disconnect: () => void;
  connecting: boolean;
}

const normalizeNetwork = (network: string): MidnightNetwork => {
  if (network === "preprod" || network === "preview" || network === "devnet" || network === "undeployed") return network;
  return "none";
};

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
        const runtime = await connectMidnightRuntime();
        if (!runtime.wallet) throw new Error("Midnight Lace connected without a wallet session.");
        const address = runtime.wallet.shieldedAddress ?? runtime.wallet.shieldedCoinPublicKey;
        const next: WalletState = {
          connected: true,
          address,
          displayAddress: displayAddress(address),
          network: normalizeNetwork(runtime.wallet.networkId),
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
    setWallet({
      connected: false,
      address: null,
      displayAddress: "Not connected",
      network: "none",
    });
  }, []);

  return { wallet, connect, disconnect, connecting };
}
