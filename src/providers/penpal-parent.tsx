"use client";

import { Connection, connectToChild as connectToChildPenpal } from "penpal";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useConnect, useConnectorClient } from "wagmi";

interface PenpalContextType {
  childConnection: Connection<any> | null;
  connectToChild: (args: Parameters<typeof connectToChildPenpal>[0]) => void;
  setIframe: React.Dispatch<React.SetStateAction<HTMLIFrameElement | null>>;
}

const PenpalContext = createContext<PenpalContextType | undefined>(undefined);

export const PenpalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [childConnection, setChildConnection] =
    useState<Connection<any> | null>(null);
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  const connectToChild = useCallback(
    (args: Parameters<typeof connectToChildPenpal>[0]) => {
      const connection = connectToChildPenpal(args);
      setChildConnection(connection);
    },
    []
  );

  useEffect(() => {
    if (childConnection) {
      iframe?.contentWindow?.postMessage(
        {
          type: "reconnect",
          key: Math.random(),
        },
        // TODO: evaluate if "*" is safe
        "*"
      );
    }
  }, [childConnection, iframe]);

  return (
    <PenpalContext.Provider
      value={{
        childConnection,
        connectToChild,
        setIframe,
      }}
    >
      {children}
    </PenpalContext.Provider>
  );
};

export const usePenpalContext = ({
  iframe,
}: {
  iframe: React.RefObject<HTMLIFrameElement>;
}): PenpalContextType => {
  const context = useContext(PenpalContext);
  if (context === undefined) {
    throw new Error("usePenpalContext must be used within a PenpalProvider");
  }

  const connection = useConnectorClient();
  const { connectors, connect } = useConnect();

  const handleRequest = useCallback(
    async (...request: any[]) => {
      if (!connection.data?.transport.request) {
        connect({ connector: connectors[0] });
        return;
      }

      const res = await connection.data?.transport.request(request[0]);
      return res;
    },
    [connection.data?.transport.request, connect, connectors]
  );

  useEffect(() => {
    if (!iframe.current) return;
    context.setIframe(iframe.current);
  }, [iframe]);

  useEffect(() => {
    if (!iframe.current) return;

    context.childConnection?.destroy();
    context.connectToChild({
      iframe: iframe.current,
      methods: {
        handleRequest,
      },
    });
  }, [iframe, handleRequest, connection.data?.transport]);

  return context;
};
