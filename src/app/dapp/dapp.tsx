"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import { Menu, X } from "lucide-react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

import { NetworkAsset } from "@/interface/network";

const DappPage = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const networkAssets: NetworkAsset[] = [
    {
      network: {
        name: "Solana",
        rpc: "",
      },
      assets: ["SOL"],
    },
  ];
  const [selectedNetwork, setSelectedNetwork] = useState("solana");
  const [selectedAsset, setSelectedAsset] = useState("sol");

  const [SOLBalance, setSOLBalance] = useState<number>(0);
  const [MIMINGBalance, setMIMINGBalance] = useState<number>(0);

  const [quantityValue, setQuantityValue] = useState("");

  const getSOLBalance = async () => {
    if (publicKey) {
      const newBalance = await connection.getBalance(publicKey);
      setSOLBalance(newBalance / LAMPORTS_PER_SOL);
    }

    setTimeout(() => {
      getSOLBalance();
    }, 10_000);
  };

  const getMIMINGBalance = async () => {
    const mimingAddress = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
    const mimingTokenMintAddress = new PublicKey(mimingAddress);

    if (publicKey) {
      const mimingAssociatedTokenAddress = await getAssociatedTokenAddress(mimingTokenMintAddress, publicKey);
      let tokenAmount = await connection.getTokenAccountBalance(mimingAssociatedTokenAddress);

      const rawAmount = parseInt(tokenAmount.value.amount);
      const decimals = tokenAmount.value.decimals;
      const readableAmount = rawAmount / Math.pow(10, decimals);

      setMIMINGBalance(readableAmount);
    }

    setTimeout(() => {
      getMIMINGBalance();
    }, 10_000);
  };

  const currentAssets = networkAssets.find((entry) => entry.network.name.toLowerCase() === selectedNetwork)?.assets || [];
  const selectDefaultAsset = (network: string) => {
    const currentAssets = networkAssets.find((entry) => entry.network.name.toLowerCase() === network)?.assets || [];
    if (currentAssets.length > 0) {
      setSelectedAsset(currentAssets[0].toLowerCase());
    }
  };

  useEffect(() => {
    getSOLBalance();
    getMIMINGBalance();
  }, [publicKey, connection]);

  const quantityHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    input = input.replace(/,/g, "");

    if (/^\d*\.?\d{0,5}$/.test(input)) {
      setQuantityValue(input);
    }
  };

  const quantityFormatWithCommas = (val: string) => {
    if (!val) return "";

    const parts = val.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];

    const withCommas = parseInt(integerPart).toLocaleString("en-US");

    return decimalPart !== undefined ? `${withCommas}.${decimalPart}` : withCommas;
  };

  const quantityHandleBlur = () => {
    setQuantityValue(quantityFormatWithCommas(quantityValue));
  };

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
                  <Select
                    value={selectedNetwork}
                    onValueChange={(value) => {
                      setSelectedNetwork(value);
                      selectDefaultAsset(value);
                    }}
                  >
                    <SelectTrigger className="w-full bg-white text-gray-800 font-bold rounded-[15px] px-3 py-3 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {networkAssets.map(({ network }) => (
                        <SelectItem key={network.name.toLowerCase()} value={network.name.toLowerCase()}>
                          <div className="flex items-center space-x-2">
                            <Image src={`/assets/${network.name.toLowerCase()}-logo.png`} alt={network.name} width={20} height={20} />
                            <span>{network.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full space-y-2">
                  <Label htmlFor="asset" className="text-lg text-[#DCB00B]">
                    Token / Asset:
                  </Label>
                  <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                    <SelectTrigger className="w-full bg-white text-gray-800 font-bold rounded-[15px] px-3 py-3 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentAssets.map((asset) => (
                        <SelectItem key={asset.toLowerCase()} value={asset.toLowerCase()}>
                          <div className="flex items-center space-x-2">
                            <Image src={`/assets/${selectedNetwork}-logo.png`} alt={asset} width={20} height={20} />
                            <span>{asset}</span>
                          </div>
                        </SelectItem>
                      ))}
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
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={quantityValue}
                      onChange={quantityHandleChange}
                      onBlur={quantityHandleBlur}
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
                      <span className="pr-[5px]">{quantityValue}</span>
                      <span className="font-bold">wSOL</span>
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full text-white text-2xl font-bold h-[70px] bg-[#3E56EF] hover:bg-[#3E56CE] rounded-[15px] hover:cursor-pointer"
              >
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
                        <td className="px-6 py-4 text-xl text-white-800 font-extrabold text-right">
                          {MIMINGBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                        </td>
                      </tr>
                      <tr className="border-t border-white/20">
                        <td className="flex items-center space-x-2 px-6 py-4">
                          <Image src="/assets/solana-logo.png" alt="SOL" width={32} height={32} />
                          <span className="text-[#DCB00B] font-bold">SOL</span>
                        </td>
                        <td className="px-6 py-4 text-xl text-white-800 font-extrabold text-right">
                          {SOLBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                        </td>
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
