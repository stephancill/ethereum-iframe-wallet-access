"use client";

import { type ReactNode, useState } from "react";
import { WagmiProviders } from "../../providers/wagmi-parent";
import { PenpalProvider } from "../../providers/penpal-parent";

export function Providers(props: { children: ReactNode }) {
  return (
    <PenpalProvider>
      <WagmiProviders>{props.children}</WagmiProviders>
    </PenpalProvider>
  );
}
