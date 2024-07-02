"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  useAccount,
  useConnect,
  useConnectorClient,
  useDisconnect,
} from "wagmi";
import { usePenpalContext } from "../../providers/penpal-parent";

export default function Page() {
  const penpal = usePenpalContext();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const connection = useConnectorClient();

  const account = useAccount();
  const { connectors, connect, status, error, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const handleRequest = useCallback(
    async (...request: any[]) => {
      if (!connection.data?.transport.request) {
        await connectAsync({ connector: connectors[0] });
      }

      const res = await connection.data?.transport.request(request[0]);
      return res;
    },
    [connection.data?.transport.request]
  );

  useEffect(() => {
    if (!iframeRef.current) return;
    penpal.setIframe(iframeRef.current);
  }, [iframeRef]);

  useEffect(() => {
    if (!iframeRef.current) return;

    penpal.childConnection?.destroy();
    penpal.connectToChild({
      iframe: iframeRef.current,
      methods: {
        handleRequest,
      },
    });
  }, [iframeRef, handleRequest, connection.data?.transport]);

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
