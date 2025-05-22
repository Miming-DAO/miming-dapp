"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import { Menu, X } from "lucide-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const DappPage = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState<number>(0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getBalanceEvery10Seconds = async () => {
    if (publicKey) {
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);
    }

    setTimeout(() => {
      getBalanceEvery10Seconds();
    }, 10_000);
  };

  useEffect(() => {
    getBalanceEvery10Seconds();
  }, [publicKey, connection, balance]);

  return (
    <div className="flex justify-center min-h-screen lg:p-4">
      <Card className="bg-[url('/assets/miming-bg.png')] bg-cover bg-center text-white border-0 w-full rounded-none lg:rounded-xl ">
        <header className="text-white px-4 sm:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Image src="/assets/miming-logo.png" alt="MIMING Logo" width={50} height={50} className="rounded-full" priority />
              <h1 className="text-2xl sm:text-3xl text-[#DCB00B] font-extrabold">MIMING CAT</h1>
            </div>

            <div className="hidden sm:flex items-center space-x-6">
              <a href="#teleport" className="font-semibold hover:text-[#DCB00B] transition-colors">
                Teleport / Cross-Chain
              </a>
              <a href="#staking" className="font-semibold hover:text-[#DCB00B] transition-colors">
                Staking
              </a>
              <WalletMultiButton
                style={{
                  backgroundColor: "white",
                  color: "black",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: "40px",
                }}
              />
            </div>

            <button className="sm:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="sm:hidden mt-4 space-y-3">
              <a href="#teleport" className="block font-semibold hover:text-[#DCB00B] transition-colors">
                Teleport / Cross-Chain
              </a>
              <a href="#staking" className="block font-semibold hover:text-[#DCB00B] transition-colors">
                Staking
              </a>
              <WalletMultiButton
                style={{
                  backgroundColor: "white",
                  color: "black",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: "40px",
                }}
              />
            </div>
          )}
        </header>

        <CardContent className="space-y-2">
          <div className="flex flex-col lg:flex-row justify-center gap-5">
            <div className="space-y-6 lg:w-[600px] md:w-full border border-white/20 bg-white/10 shadow-lg px-8 py-4 rounded-[15px]">
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-full space-y-2">
                  <Label htmlFor="network" className="text-lg text-[#DCB00B]">
                    Network:
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full bg-white text-gray-800 font-bold rounded-[15px] px-3 py-3 focus:ring-0">
                      <SelectValue placeholder="Select Network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solana">
                        <div className="flex items-center space-x-2">
                          <Image src="/assets/solana-logo.png" alt="Solana" width={20} height={20} />
                          <span>Solana</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="polkadot">
                        <div className="flex items-center space-x-2">
                          <Image src="/assets/polkadot-logo.png" alt="Polkadot" width={20} height={20} />
                          <span>Polkadot</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full space-y-2">
                  <Label htmlFor="asset" className="text-lg text-[#DCB00B]">
                    Token / Asset:
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full bg-white text-gray-800 font-bold rounded-[15px] px-3 py-3 focus:ring-0">
                      <SelectValue placeholder="Select Asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sol">
                        <div className="flex items-center space-x-2">
                          <Image src="/assets/solana-logo.png" alt="SOL" width={20} height={20} />
                          <span>SOL</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dot">
                        <div className="flex items-center space-x-2">
                          <Image src="/assets/polkadot-logo.png" alt="DOT" width={20} height={20} />
                          <span>DOT</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-lg text-[#DCB00B]">
                  Quantity:
                </Label>
                <div className="flex items-center space-x-3 bg-white rounded-[15px] px-3 py-3">
                  <div className="relative w-full">
                    <Input
                      id="quantity"
                      placeholder="0.00"
                      className="teleport-input-default-font-size bg-transparent text-gray-800 pr-[65px] text-right font-bold border-none focus:ring-0 placeholder:text-gray-400"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 font-bold text-2xl">SOL</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="xode-recipient" className="text-lg text-[#DCB00B]">
                  Xode Recipient Address:
                </Label>
                <div className="flex items-center space-x-3 bg-white rounded-[15px] px-3 py-3">
                  <Image src="/assets/xode-logo.png" alt="Recipient" width={40} height={40} className="rounded-full" />
                  <Input
                    id="xode-recipient"
                    placeholder="Enter wallet address"
                    className="bg-transparent text-gray-800 font-bold border-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="xode-asset-received" className="text-lg text-[#DCB00B]">
                  Xode Asset Received:
                </Label>
                <div className="flex items-center space-x-3 bg-[#DCB00B] rounded-[15px] px-3 py-3">
                  <Image src="/assets/xode-logo.png" alt="Received Asset" width={40} height={40} className="rounded-full" />

                  <div className="relative w-full text-right">
                    <p id="xode-asset-received" className="inline-block text-gray-800 text-2xl font-bold">
                      <span className="pr-[5px]">1.2</span>
                      <span className="font-bold">wSOL</span>
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="secondary" className="w-full text-white text-2xl font-bold h-[70px] bg-[#3E56EF] hover:bg-[#3E56CE] rounded-[15px]">
                Teleport
              </Button>

              <div className="w-full text-center">
                <p className="text-white">
                  Teleport will only freeze your asset on your wallet while minting equivalent wrapped asset. 100 MIMING will be locked to secure the
                  asset.
                </p>
              </div>
            </div>

            <div className="space-y-6 lg:w-[400px] sm:w-full border border-white/20 bg-white/10 shadow-lg px-8 py-4 rounded-[15px]">
              <div className="space-y-2">
                <Label htmlFor="assetTeleport" className="text-lg text-[#DCB00B]">
                  Your Assets:
                </Label>

                <div className="overflow-x-auto border border-white/20 bg-white/10 shadow-lg rounded-[10px]">
                  <table className="min-w-full table-auto overflow-hidden">
                    <thead>
                      <tr>
                        <th className="text-left text-[#DCB00B] px-6 py-3 text-sm font-semibold">Asset</th>
                        <th className="text-left text-[#DCB00B] px-6 py-3 text-sm font-semibold text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-white/20">
                        <td className="flex items-center space-x-2 px-6 py-4">
                          <Image src="/assets/miming-logo.png" alt="MIMING" width={32} height={32} />
                          <span className="text-[#DCB00B] font-bold">MIMING</span>
                        </td>
                        <td className="px-6 py-4 text-xl text-white-800 font-extrabold text-right">1,000</td>
                      </tr>
                      <tr className="border-t border-white/20">
                        <td className="flex items-center space-x-2 px-6 py-4">
                          <Image src="/assets/solana-logo.png" alt="SOL" width={32} height={32} />
                          <span className="text-[#DCB00B] font-bold">SOL</span>
                        </td>
                        <td className="px-6 py-4 text-xl text-white-800 font-extrabold text-right">{balance}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DappPage;
