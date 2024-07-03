"use client";

import { type ReactNode } from "react";
import { PenpalProvider } from "../../providers/penpal-parent";
import { WagmiProviders } from "../../providers/wagmi-parent";

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProviders>
      <PenpalProvider>{props.children}</PenpalProvider>
    </WagmiProviders>
  );
}
