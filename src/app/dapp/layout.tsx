"use client";

import SolanaWalletProvider from "@/components/solana-wallet-provider";

export default function DappLayout({ children }: { children: React.ReactNode }) {
  return <SolanaWalletProvider>{children}</SolanaWalletProvider>;
}
