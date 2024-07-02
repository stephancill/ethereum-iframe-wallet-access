"use client";

import { type ReactNode, useState } from "react";
import { WagmiProviders } from "../../providers/wagmi-child";
import { PenpalProvider } from "../../providers/penpal-child";

export function Providers(props: { children: ReactNode }) {
  return (
    <PenpalProvider>
      <WagmiProviders>{props.children}</WagmiProviders>
    </PenpalProvider>
  );
}
