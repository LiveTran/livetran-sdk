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
} from "../types/config.js";

import { SDKError } from "./error.js";

/**
 * UNIVERSAL HMAC (Workers first → Node fallback)
 */
async function generateHMAC(secret: string, requestBody: string): Promise<string> {
  const enc = new TextEncoder();
  const bodyBytes = enc.encode(requestBody);
  const secretBytes = enc.encode(secret);

  // Cloudflare / Browser / Bun / Deno
  if (globalThis.crypto?.subtle) {
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", key, bodyBytes);

    return [...new Uint8Array(signature)]
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Node.js fallback
  const nodeCrypto = await import("crypto");
  return nodeCrypto.createHmac("sha256", secret).update(requestBody).digest("hex");
}


function normalizeResponse(json: any) {
  if (json?.data) return json.data;
  return json;
}


async function safeParse(response: Response, status: number) {
  try {
    return await response.json();
  } catch {
    const text = await response.text();
    throw new SDKError(text || "Invalid response from server", status);
  }
}


export class SelfHostedLiveTran {
  private sharedSecret: string;
  private baseUrl: string;

  constructor(config: SelfHostedLiveTranConfig) {
    this.baseUrl = config.baseURL;
    this.sharedSecret = config.sharedSecret;
  }

  private async send(path: string, body: any) {
    const requestBody = JSON.stringify(body);
    const signature = await generateHMAC(this.sharedSecret, requestBody);

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LT-SIGNATURE": signature,
      },
      body: requestBody,
    });

    const json = await safeParse(response, response.status);

    if (!response.ok) {
      throw new SDKError(json?.error || "Unknown error", response.status);
    }

    return normalizeResponse(json);
  }

  async startStream(body: SelfHostedStartArgs): Promise<SelfHostedServerResponse> {
    const data = await this.send("/api/start-stream", body);
    return { success: true, data };
  }

  async stopStream(body: SelfHostedStopArgs): Promise<SelfHostedServerResponse> {
    const data = await this.send("/api/stop-stream", body);
    return { success: true, data };
  }

  async status(body: SelfHostedStopArgs): Promise<SelfHostedServerResponse> {
    const data = await this.send("/api/status", body);
    return { success: true, data };
  }
}


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

  private async send(path: string, body: any) {
    const fullBody = {
      api_key: this.ApiKey,
      project_id: this.ProjectId,
      ...body,
    };

    const requestBody = JSON.stringify(fullBody);
    const signature = await generateHMAC(this.SharedSecret, requestBody);

    const response = await fetch(`${this.ApiBaseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LT-SIGNATURE": signature,
      },
      body: requestBody,
    });

    const json = await safeParse(response, response.status);

    if (!response.ok) {
      throw new SDKError(json?.error || "Unknown error", response.status);
    }

    return normalizeResponse(json);
  }

  async startStream(body: LiveTranStartArgs): Promise<StartResponse> {
    const data = await this.send("/api/v1/stream/start", body);

    return {
      data: {
        output_url: data.output_url,
        srt_url: data.srt_url,
      },
    };
  }

  async stopStream(body: LiveTranStopArgs): Promise<StopResponse> {
    const data = await this.send("/api/v1/stream/stop", body);

    return {
      data: {
        message: data.message,
      },
    };
  }
}
