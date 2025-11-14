import {
  LiveTranConfig,
  LiveTranStartArgs,
  LiveTranStopArgs,
  SelfHostedLiveTranConfig,
  SelfHostedServerResponse,
  SelfHostedStartArgs,
  SelfHostedStopArgs,
  StartResponse,
  StopResponse,
} from "../types/config";

import { SDKError } from "./error";

/**
 * UNIVERSAL HMAC (Web Crypto first → Node fallback)
 */
async function generateHMAC(secret: string, requestBody: string): Promise<string> {
  const encoder = new TextEncoder();
  const bodyBytes = encoder.encode(requestBody);
  const secretBytes = encoder.encode(secret);

  // Cloudflare Workers / Browser / Bun / Deno
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    const key = await globalThis.crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sig = await globalThis.crypto.subtle.sign("HMAC", key, bodyBytes);

    return [...new Uint8Array(sig)]
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Node.js fallback
  const nodeCrypto = await import("crypto");
  return nodeCrypto
    .createHmac("sha256", secret)
    .update(requestBody)
    .digest("hex");
}

/* ============================================================================
   SELF-HOSTED SDK
============================================================================ */

export class SelfHostedLiveTran {
  private sharedSecret: string;
  private baseUrl: string;

  constructor(config: SelfHostedLiveTranConfig) {
    this.baseUrl = config.baseURL;
    this.sharedSecret = config.sharedSecret;
  }

  async startStream(streamBody: SelfHostedStartArgs): Promise<SelfHostedServerResponse> {
    const requestBody = JSON.stringify(streamBody);
    const signature = await generateHMAC(this.sharedSecret, requestBody);

    const response = await fetch(`${this.baseUrl}/api/start-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LT-SIGNATURE": signature,
      },
      body: requestBody,
    });

    const json = await response.json();
    if (!response.ok || json.success !== true) {
      throw new SDKError(json?.error || "Unknown error", response.status);
    }

    return { success: true, data: json.data };
  }

  async stopStream(streamBody: SelfHostedStopArgs): Promise<SelfHostedServerResponse> {
    const requestBody = JSON.stringify(streamBody);
    const signature = await generateHMAC(this.sharedSecret, requestBody);

    const response = await fetch(`${this.baseUrl}/api/stop-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LT-SIGNATURE": signature,
      },
      body: requestBody,
    });

    const json = await response.json();
    if (!response.ok || json.success !== true) {
      throw new SDKError(json?.error || "Unknown error", response.status);
    }

    return { success: true, data: json.data };
  }

  async status(streamBody: SelfHostedStopArgs): Promise<SelfHostedServerResponse> {
    const requestBody = JSON.stringify(streamBody);
    const signature = await generateHMAC(this.sharedSecret, requestBody);

    const response = await fetch(`${this.baseUrl}/api/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LT-SIGNATURE": signature,
      },
      body: requestBody,
    });

    const json = await response.json();
    if (!response.ok || json.success !== true) {
      throw new SDKError(json?.error || "Unknown error", response.status);
    }

    return { success: true, data: json.data };
  }
}

/* ============================================================================
   CLOUD / SaaS SDK
============================================================================ */

export class LiveTranSDK {
  private SharedSecret: string;
  private ApiBaseUrl: string;
  private ProjectId: string;
  private ApiKey: string;

  constructor(config: LiveTranConfig) {
    this.ApiBaseUrl = config.baseURL;
    this.SharedSecret = config.sharedSecret;
    this.ProjectId = config.projectID;
    this.ApiKey = config.apiKey;
  }

  async startStream(streamBody: LiveTranStartArgs): Promise<StartResponse> {
    const fullBody = {
      api_key: this.ApiKey,
      project_id: this.ProjectId,
      ...streamBody,
    };

    const requestBody = JSON.stringify(fullBody);
    const signature = await generateHMAC(this.SharedSecret, requestBody);

    const response = await fetch(`${this.ApiBaseUrl}/api/v1/stream/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LT-SIGNATURE": signature,
      },
      body: requestBody,
    });

    const json = await response.json();
    if (!response.ok) {
      throw new SDKError(json?.error || "Unknown error", response.status);
    }

    return {
      data: {
        output_url: json.data.output_url,
        srt_url: json.data.srt_url,
      },
    };
  }

  async stopStream(streamBody: LiveTranStopArgs): Promise<StopResponse> {
    const fullBody = {
      api_key: this.ApiKey,
      ...streamBody,
    };

    const requestBody = JSON.stringify(fullBody);
    const signature = await generateHMAC(this.SharedSecret, requestBody);

    const response = await fetch(`${this.ApiBaseUrl}/api/v1/stream/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LT-SIGNATURE": signature,
      },
      body: requestBody,
    });

    const json = await response.json();
    if (!response.ok) {
      throw new SDKError(json?.error || "Unknown error", response.status);
    }

    return {
      data: {
        message: json.data.message,
      },
    };
  }
}
