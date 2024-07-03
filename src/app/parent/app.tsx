"use client";

import { useRef } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { usePenpalContext } from "../../providers/penpal-parent";

export default function Page() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  usePenpalContext({ iframe: iframeRef });

  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div>
      <h1>Parent</h1>
      <p>This is the parent page.</p>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
          <br />
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      <iframe
        ref={iframeRef}
        className="transition-all duration-150 ease-in-out"
        referrerPolicy="no-referrer"
        width={500}
        height={500}
        src={"/child"}
        title="Frames.fun iframe"
        // onLoad={handleLoad}
        // onError={handleError}
      />
    </div>
  );
}
