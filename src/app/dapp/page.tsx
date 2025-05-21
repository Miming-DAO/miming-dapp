"use client";

import dynamic from "next/dynamic";

const Dapp = dynamic(() => import("@/app/dapp/dapp"), {
  ssr: false,
});

export default function DappPage() {
  return <Dapp />;
}
