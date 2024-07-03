"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
} from "wagmi";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const transaction = useSendTransaction();

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        <div>
          <button
            type="button"
            onClick={async () => {
              let address = account.address;
              if (!account.address) {
                const connectData = await connectAsync({
                  connector: connectors[0],
                });
                address = connectData.accounts[0];
              }

              if (!address) {
                return;
              }

              transaction.sendTransaction({
                to: address,
              });
            }}
          >
            Send tx
          </button>
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
    </>
  );
}

export default App;
