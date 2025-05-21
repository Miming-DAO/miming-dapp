import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen p-4">
      <Card className="bg-[url('/assets/miming-bg.png')] bg-cover bg-center text-white border-0 w-full">
        <div className="flex justify-between items-center px-6">
          <div className="flex items-center ml-[-6px]">
            <Image src="/assets/miming-logo.png" alt="MIMING Logo" width={100} height={100} className="rounded-full" priority />
            <h1 className="text-3xl text-[#DCB00B] font-bold">MIMING CAT</h1>
          </div>
          <Button variant="secondary" className="text-black bg-white hover:bg-gray-200 lg:mr-6">
            Connect Wallet
          </Button>
        </div>
        <CardContent className="space-y-2">
          <div className="px-4">
            {/* <Tabs defaultValue="account" className="">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="teleport-cross-chain">Teleport/Cross Chain</TabsTrigger>
                <TabsTrigger value="staking">Staking</TabsTrigger>
              </TabsList>
              <TabsContent value="teleport-cross-chain">
               
              </TabsContent>
              <TabsContent value="staking"></TabsContent>
            </Tabs> */}
            <div className="flex justify-center">
              <div className="space-y-6 mt-6 w-[500px]">
                {/* Asset to Teleport */}
                <div className="space-y-2">
                  <Label htmlFor="assetTeleport" className="text-lg text-[#DCB00B]">
                    Asset to Teleport
                  </Label>
                  <div className="flex items-center space-x-3 bg-white rounded-[15px] px-3 py-3">
                    <Image src="/assets/solana-logo.png" alt="Asset Logo" width={40} height={40} className="rounded-full" />
                    <Input
                      id="assetTeleport"
                      placeholder="e.g., SOL"
                      className="bg-transparent text-black asset-to-teleport-input text-right font-extrabold border-none focus:ring-0 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Spacer */}
                <div className="h-4" />

                {/* Recipient */}
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-lg text-[#DCB00B]">
                    Recipient
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

                {/* Asset Received */}
                <div className="space-y-2">
                  <Label htmlFor="assetReceived" className="text-lg text-[#DCB00B]">
                    Asset Received
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

                {/* Teleport Button */}
                <Button variant="secondary" className="w-full text-white text-2xl font-bold h-[70px] bg-[#3E56EF] hover:bg-[#3E56CE] rounded-[15px]">
                  Teleport
                </Button>

                {/* Info Text */}
                <div className="w-full text-center">
                  <p className="text-white">
                    Teleport will only freeze your asset on your wallet while minting equivalent wrapped asset. 100 MIMING will be locked to secure
                    the asset.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
