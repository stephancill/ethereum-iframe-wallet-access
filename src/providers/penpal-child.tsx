"use client";

import { Connection, connectToParent as connectToParentPenpal } from "penpal";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface PenpalContextType {
  parentConnection: ReturnType<typeof connectToParentPenpal> | null;
  connectToParent: (args: Parameters<typeof connectToParentPenpal>[0]) => void;
  handleRequest: (request: any[]) => Promise<any>;
}

const PenpalContext = createContext<PenpalContextType | undefined>(undefined);

export const PenpalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [parentConnection, setParentConnection] =
    useState<Connection<any> | null>(null);
  const [connectionKey, setConnectionKey] = useState<string | null>("1");

  const handleRequest = useCallback(
    async (request: any[]) => {
      if (!parentConnection) {
        throw new Error("No parent onnection");
      }
      return parentConnection.promise.then(async (parent) => {
        const result = await parent.handleRequest(request);
        return result;
      });
    },
    [parentConnection]
  );

  const connectToParent = useCallback(
    (args: Parameters<typeof connectToParentPenpal>[0]) => {
      const connection = connectToParentPenpal(args);
      setParentConnection(connection);
    },
    []
  );

  const parentMethods = useMemo(() => {
    return {
      methods: {
        reconnect(key: string) {
          setConnectionKey(key);
        },
      },
    };
  }, []);

  useEffect(() => {
    if (parentMethods && connectionKey) {
      parentConnection?.destroy();
      connectToParent({
        methods: parentMethods,
      });
    }
  }, [connectionKey, parentMethods]);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      // Reload connection if key changes
      event.data?.key && setConnectionKey(event.data.key);
    });
  }, []);

  return (
    <PenpalContext.Provider
      value={{
        parentConnection,
        connectToParent,
        handleRequest,
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
      "usePenpalContext child must be used within a PenpalProvider"
    );
  }
  return context;
};
