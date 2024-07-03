import * as wagmiChains from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const chains = [mainnet, sepolia] as const;
