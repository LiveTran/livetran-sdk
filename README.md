# LiveTran SDK 📦

**LiveTran SDK** is the official TypeScript client for [LiveTran](https://github.com/Livetran/LiveTran) – a self-hostable, high-performance live streaming media server.

It provides a simple API to interact with the **LiveTran Server**: start/stop streams, fetch status, and integrate streaming into your Node.js or frontend applications.

---

## ✨ Features

* 🔑 **Stream Management** – Start, stop, and monitor streams programmatically
* 🎚 **Adaptive Bitrate (ABR)** playback integration
* 🔐 **HMAC-secured APIs** with signed requests
* ⚡ **TypeScript-first** – Includes full typings and intellisense
* 🛠 Works in **Node.js & Browser** environments (Cloudflare Workers, Bun, Deno)
* 🌐 **Universal Crypto** – Uses Web Crypto API with Node.js fallback

---

## 🚀 Installation

```bash
npm i @vijayvenkatj/livetran-sdk
```

---

## 📖 Usage

The SDK provides two client classes depending on your deployment:

### Self-Hosted LiveTran Server

For self-hosted LiveTran instances:

```ts
import { SelfHostedLiveTran } from "@vijayvenkatj/livetran-sdk";

const client = new SelfHostedLiveTran({
  baseURL: "http://localhost:8080", // your self-hosted server URL
  sharedSecret: process.env.LIVETRAN_SHARED_SECRET, // HMAC signing secret
});
```

#### Start a Stream

```ts
const response = await client.startStream({
  stream_id: "my-awesome-stream",
  webhook_urls: ["https://my-service.com/webhook"],
  abr: true, // enable adaptive bitrate
});

console.log(response);
// { success: true, data: "..." }
```

#### Stop a Stream

```ts
const response = await client.stopStream({
  stream_id: "my-awesome-stream",
});

console.log(response);
// { success: true, data: "..." }
```

#### Check Stream Status

```ts
const response = await client.status({
  stream_id: "my-awesome-stream",
});

console.log(response);
// { success: true, data: "..." }
```

---

### Hosted LiveTran Service

For the hosted LiveTran platform:

```ts
import { LiveTranSDK } from "@vijayvenkatj/livetran-sdk";

const client = new LiveTranSDK({
  baseURL: "https://api.livetran.com", // LiveTran API base URL
  sharedSecret: process.env.LIVETRAN_SHARED_SECRET, // HMAC signing secret
  projectID: process.env.LIVETRAN_PROJECT_ID, // your project ID
  apiKey: process.env.LIVETRAN_API_KEY, // your API key
});
```

#### Start a Stream

```ts
const response = await client.startStream({
  title: "My Live Stream",
  description: "Optional stream description",
  stream_key: "your-stream-key",
});

console.log(response);
// {
//   data: {
//     output_url: "https://...",
//     srt_url: "srt://...",
//   }
// }
```

#### Stop a Stream

```ts
const response = await client.stopStream({
  stream_key: "your-stream-key",
});

console.log(response);
// {
//   data: {
//     message: "Stream stopped successfully",
//   }
// }
```

---

## 🛠 Error Handling

The SDK throws `SDKError` for API errors:

```ts
import { SDKError } from "@vijayvenkatj/livetran-sdk";

try {
  await client.startStream({ ... });
} catch (error) {
  if (error instanceof SDKError) {
    console.error(`API Error (${error.statusCode}): ${error.message}`);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

---

## 📚 API Reference

### `SelfHostedLiveTran`

#### Constructor

```ts
new SelfHostedLiveTran(config: SelfHostedLiveTranConfig)
```

**Config:**
- `baseURL: string` – Your self-hosted LiveTran server URL
- `sharedSecret: string` – HMAC signing secret for request authentication

#### Methods

- **`startStream(args: SelfHostedStartArgs): Promise<SelfHostedServerResponse>`**
  - `stream_id: string` – Unique identifier for the stream
  - `webhook_urls: string[]` – Array of webhook URLs to notify
  - `abr: boolean` – Enable adaptive bitrate streaming

- **`stopStream(args: SelfHostedStopArgs): Promise<SelfHostedServerResponse>`**
  - `stream_id: string` – Stream identifier to stop

- **`status(args: SelfHostedStopArgs): Promise<SelfHostedServerResponse>`**
  - `stream_id: string` – Stream identifier to check status

---

### `LiveTranSDK`

#### Constructor

```ts
new LiveTranSDK(config: LiveTranConfig)
```

**Config:**
- `baseURL: string` – LiveTran API base URL
- `sharedSecret: string` – HMAC signing secret
- `projectID: string` – Your LiveTran project ID
- `apiKey: string` – Your LiveTran API key

#### Methods

- **`startStream(args: LiveTranStartArgs): Promise<StartResponse>`**
  - `title: string` – Stream title
  - `description?: string` – Optional stream description
  - `stream_key: string` – Stream key for authentication

- **`stopStream(args: LiveTranStopArgs): Promise<StopResponse>`**
  - `stream_key: string` – Stream key to stop

---

## 🔐 Security

All requests are signed using HMAC-SHA256 signatures. The SDK automatically:
1. Generates signatures using your `sharedSecret`
2. Includes the signature in the `LT-SIGNATURE` header
3. Works across different JavaScript runtimes (Node.js, Cloudflare Workers, Bun, Deno)

---

## 📦 TypeScript Support

Full TypeScript definitions are included. All types are exported:

```ts
import type {
  SelfHostedLiveTranConfig,
  SelfHostedStartArgs,
  SelfHostedStopArgs,
  SelfHostedServerResponse,
  LiveTranConfig,
  LiveTranStartArgs,
  LiveTranStopArgs,
  StartResponse,
  StopResponse,
} from "@vijayvenkatj/livetran-sdk";
```

---

## 🛠 Requirements

* Node.js ≥ 18 (or compatible runtime)
* A running [LiveTran server](https://github.com/Livetran/LiveTran) (for self-hosted) or LiveTran account (for hosted)

---

## 🌐 Use Cases

* Automating stream lifecycle in your backend
* Embedding **secure low-latency playback** into web apps
* Building dashboards or monitoring tools around LiveTran
* Integrating streaming into serverless functions (Cloudflare Workers, Vercel, etc.)

---

## 📜 Development

```bash
# Build the project
npm run build

# The build output will be in the `dist/` directory
```

---

## 🤝 Contributing

Contributions are welcome to improve the SDK!

1. Fork the repo
2. Create a feature branch
3. Submit a PR

---

## 📄 License

MIT
