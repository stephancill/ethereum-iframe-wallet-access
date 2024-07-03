import dynamic from "next/dynamic";
import "../globals.css";

import { Providers } from "./providers";

const App = dynamic(() => import("./app"), { ssr: false });

export default function Page() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}
