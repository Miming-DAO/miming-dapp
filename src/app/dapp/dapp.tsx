"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const DappPage = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState<number>(0);

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
    <div className="flex justify-center min-h-screen p-4">
      <Card className="bg-[url('/assets/miming-bg.png')] bg-cover bg-center text-white border-0 w-full">
        <div className="flex justify-between items-center px-8">
          <div className="flex items-center space-x-3">
            <Image src="/assets/miming-logo.png" alt="MIMING Logo" width={70} height={70} className="rounded-full" priority />
            <h1 className="text-3xl text-[#DCB00B] font-extrabold">MIMING CAT</h1>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#teleport" className="text-white font-semibold hover:text-[#DCB00B] transition-colors">
              Teleport / Cross-Chain
            </a>
            <a href="#staking" className="text-white font-semibold hover:text-[#DCB00B] transition-colors">
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
        </div>

        <CardContent className="space-y-2">
          <div className="flex justify-center space-x-5">
            <div className="space-y-6 w-[400px] border border-white/20 bg-white/10 shadow-lg px-8 py-4 rounded-[15px]">
              <div className="space-y-2">
                <Label htmlFor="assetTeleport" className="text-lg text-[#DCB00B]">
                  Your Balances:
                </Label>

                <div className="flex items-center bg-white rounded-[15px]">
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 w-full">
                    <div className="flex items-center space-x-2">
                      <Image src="/assets/miming-logo.png" alt="MIMING" width={32} height={32} />
                      <span className="text-[#DCB00B] font-bold">MIMING:</span>
                    </div>
                    <p className="text-3xl text-black font-extrabold mt-1">1,000</p>
                  </div>
                </div>

                <div className="flex items-center bg-white rounded-[15px]">
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 w-full">
                    <div className="flex items-center space-x-2">
                      <Image src="/assets/solana-logo.png" alt="SOL" width={32} height={32} />
                      <span className="text-[#DCB00B] font-bold">SOL:</span>
                    </div>
                    <p className="text-3xl text-black font-extrabold mt-1">{balance}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 w-[600px] border border-white/20 bg-white/10 shadow-lg px-8 py-4 rounded-[15px]">
              <div className="space-y-2">
                <Label htmlFor="assetTeleport" className="text-lg text-[#DCB00B]">
                  Asset to Teleport:
                </Label>
                <div className="flex items-center space-x-3 bg-white rounded-[15px] px-3 py-3">
                  <Image src="/assets/solana-logo.png" alt="Asset Logo" width={40} height={40} className="rounded-full" />
                  <Input
                    id="assetTeleport"
                    placeholder="0.00 SOL"
                    className="bg-transparent text-black asset-to-teleport-input text-right font-bold border-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="h-4" />

              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-lg text-[#DCB00B]">
                  Recipient:
                </Label>
                <div className="flex items-center space-x-3 bg-white rounded-[15px] px-3 py-3">
                  <Image src="/assets/xode-logo.png" alt="Recipient" width={40} height={40} className="rounded-full" />
                  <Input
                    id="recipient"
                    placeholder="Enter wallet address"
                    className="bg-transparent text-black text-4xl font-bold border-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetReceived" className="text-lg text-[#DCB00B]">
                  Asset Received:
                </Label>
                <div className="flex items-center space-x-3 bg-[#DCB00B] rounded-[15px] px-3 py-3">
                  <Image src="/assets/xode-logo.png" alt="Received Asset" width={40} height={40} className="rounded-full" />
                  <div className="w-full text-right">
                    <p id="assetReceived" className="text-black text-4xl font-bold">
                      1.2 wSOL
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DappPage;
