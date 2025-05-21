"use client";

import AppWalletProvider from "@/components/app-wallet-provider";

export default function DappLayout({ children }: { children: React.ReactNode }) {
  return <AppWalletProvider>{children}</AppWalletProvider>;
}
