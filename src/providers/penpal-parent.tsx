"use client";

import {
  connectToParent as connectToParentPenpal,
  connectToChild as connectToChildPenpal,
  Connection,
} from "penpal";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

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
    console.log(`child connection changed`, childConnection);

    if (childConnection) {
      console.log("reconnecting");
      iframe?.contentWindow?.postMessage(
        {
          type: "reconnect",
          key: Math.random(),
        },
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

export const usePenpalContext = (): PenpalContextType => {
  const context = useContext(PenpalContext);
  if (context === undefined) {
    throw new Error(
      "usePenpalContext parents must be used within a PenpalProvider"
    );
  }
  return context;
};
