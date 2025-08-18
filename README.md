# LiveTran SDK 📦

**LiveTran SDK** is the official TypeScript client for [LiveTran](https://github.com/Livetran/LiveTran) – a self-hostable, high-performance live streaming media server.

It provides a simple API to interact with the **LiveTran Server**: start/stop streams, fetch status, and integrate streaming into your Node.js or frontend applications.

---

## ✨ Features

* 🔑 **Stream Management** – Start, stop, and monitor streams programmatically
* 📡 **Low-Latency HLS (LL-HLS)** support
* 🎚 **Adaptive Bitrate (ABR)** playback integration
* 🔐 **JWT-secured APIs** with signed requests
* ⚡ **TypeScript-first** – Includes full typings and intellisense
* 🛠 Works in **Node.js & Browser** environments

---

## 🚀 Installation

```bash
npm i @vijayvenkatj/livetran-sdk
```

## 📖 Usage

### Initialize Client

```ts
import { LiveTran } from "livetran-sdk";

const client = new LiveTran({
  baseUrl: "http://localhost:8080", // your LiveTran server
  apiKey: process.env.LIVETRAN_API_KEY, // optional, if secured
});
```

---

### Start a Stream

```ts
await client.stream.start({
  stream_id: "my-awesome-stream",
  webhook_urls: ["https://my-service.com/webhook"],
});
```

---

### Stop a Stream

```ts
await client.stream.stop({
  stream_id: "my-awesome-stream",
});
```

---

### Check Stream Status

```ts
const status = await client.stream.status({
  stream_id: "my-awesome-stream",
});

console.log(status);
/*
{
  stream_id: "my-awesome-stream",
  active: true,
  renditions: ["1080p", "720p", "480p"],
  started_at: "2025-08-18T12:00:00Z"
}
*/
```

---

## 🛠 Requirements

* Node.js ≥ 18
* A running [LiveTran server](https://github.com/your-username/LiveTran)

---

## 🌐 Use Cases

* Automating stream lifecycle in your backend
* Embedding **secure low-latency playback** into web apps
* Building dashboards or monitoring tools around LiveTran

---

## 📜 API Coverage

* `stream.start()` → Start a live stream
* `stream.stop()` → Stop an active stream
* `stream.status()` → Get stream state
* *(more endpoints coming soon...)*

---

## 🤝 Contributing

Contributions are welcome to improve the SDK!

1. Fork the repo
2. Create a feature branch
3. Submit a PR
