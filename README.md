# iframe wallet access prototype demo

This is a prototype of an architecture that lets you access the user's connected wallet from within an iframe.

## How it works

- Uses [Penpal](https://github.com/Aaronius/penpal/blob/master/src/child/connectToParent.ts) for async cross-origin communication between the parent window and the iframe with return values
- The parent exposes a handleRequest method which is a EIP-1193 compliant `request` method
- The iframe uses a connection which implements a provider that sends requests to the parent window

## How to run

```
cp .env.sample .env
```

```
pnpm install
```

```
pnpm run dev
```

Go to `http://localhost:3000` in your browser.
