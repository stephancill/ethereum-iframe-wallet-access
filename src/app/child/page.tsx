import "../globals.css";

import App from "./app";
import { Providers } from "./providers";

export default function Page() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}
