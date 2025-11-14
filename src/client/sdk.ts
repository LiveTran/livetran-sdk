import { LiveTranConfig, LiveTranStartArgs, LiveTranStopArgs, SelfHostedLiveTranConfig, SelfHostedServerResponse, SelfHostedStartArgs, SelfHostedStopArgs, StartResponse, StopResponse } from '../types/config'
import crypto from 'crypto';
import fetch from "node-fetch";
import { SDKError } from './error';


export class SelfHostedLiveTran {

    private sharedSecret: string;
    private baseUrl: string;

    constructor (config: SelfHostedLiveTranConfig) {
        this.baseUrl = config.baseURL
        this.sharedSecret = config.sharedSecret
    }
    

    private generateHMAC(requestBody: string) {
        const sig = crypto
            .createHmac('sha256', this.sharedSecret)
            .update(requestBody)
            .digest('hex');
        return sig;
    }

    async startStream(streamBody: SelfHostedStartArgs): Promise<SelfHostedServerResponse> {

        const requestBody = JSON.stringify(streamBody)

        const signature = this.generateHMAC(requestBody)

        const response = await fetch(`${this.baseUrl}/api/start-stream`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LT-SIGNATURE": signature
            },
            body: requestBody
        })

        let responseJson: any;
        try {
            responseJson = await response.json();
        } 
        catch (err) {
            throw new SDKError("Invalid JSON response", response.status);
        }

        if (!response.ok || responseJson.success !== true) {
            throw new SDKError(
                responseJson?.error || "Unknown error",
                response.status
            );
        }

        return {
            success: true,
            data: responseJson.data,
        };

    }

    async stopStream(streamBody: SelfHostedStartArgs): Promise<SelfHostedServerResponse> {

        const requestBody = JSON.stringify(streamBody)

        const signature = this.generateHMAC(requestBody)

        const response = await fetch(`${this.baseUrl}/api/stop-stream`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LT-SIGNATURE": signature
            },
            body: requestBody
        })

        let responseJson: any;
        try {
            responseJson = await response.json();
        } 
        catch (err) {
            throw new SDKError("Invalid JSON response", response.status);
        }

        if (!response.ok || responseJson.success !== true) {
            throw new SDKError(
                responseJson?.error || "Unknown error",
                response.status
            );
        }

        return {
            success: true,
            data: responseJson.data,
        };

    }

    async status(streamBody: SelfHostedStopArgs): Promise<SelfHostedServerResponse> {
        const requestBody = JSON.stringify(streamBody)

        const signature = this.generateHMAC(requestBody)

        const response = await fetch(`${this.baseUrl}/api/status`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LT-SIGNATURE": signature
            },
            body: requestBody
        })

        let responseJson: any;
        try {
            responseJson = await response.json();
        } 
        catch (err) {
            throw new SDKError("Invalid JSON response", response.status);
        }

        if (!response.ok || responseJson.success !== true) {
            throw new SDKError(
                responseJson?.error || "Unknown error",
                response.status
            );
        }

        return {
            success: true,
            data: responseJson.data,
        };

    }
}


export class LiveTranSDK {

    private SharedSecret: string;
    private ApiBaseUrl: string;
    private ProjectId: string;
    private ApiKey: string;


    constructor (config: LiveTranConfig) {
        this.ApiBaseUrl = config.baseURL
        this.SharedSecret = config.sharedSecret
        this.ProjectId = config.projectID
        this.ApiKey = config.apiKey
    }

    private generateHMAC(requestBody: string) {
        const sig = crypto
            .createHmac('sha256', this.SharedSecret)
            .update(requestBody)
            .digest('hex');
        return sig;
    }

    async startStream(streamBody: LiveTranStartArgs): Promise<StartResponse> {

        const fullBody = {
            api_key: this.ApiKey,
            project_id: this.ProjectId,
            ...streamBody
        };
    
        const requestBody = JSON.stringify(fullBody);
        const signature = this.generateHMAC(requestBody);
    
        const response = await fetch(`${this.ApiBaseUrl}/api/v1/stream/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LT-SIGNATURE": signature
            },
            body: requestBody
        });
    
        const responseJson = await response.json();
    
        if (!response.ok || responseJson.success !== true) {
            throw new SDKError(
                responseJson?.error || "Unknown error",
                response.status
            );
        }
    
        return {
            data: {
                output_url: responseJson.data.output_url,
                srt_url: responseJson.data.srt_url
            }
        };
    }
    

    async stopStream(streamBody: LiveTranStopArgs): Promise<StopResponse> {

        const fullBody = {
            api_key: this.ApiKey,
            ...streamBody
        };
    
        const requestBody = JSON.stringify(fullBody);
        const signature = this.generateHMAC(requestBody);
    
        const response = await fetch(`${this.ApiBaseUrl}/api/v1/stream/stop`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LT-SIGNATURE": signature
            },
            body: requestBody
        });
    
        const responseJson = await response.json();
    
        if (!response.ok || responseJson.success !== true) {
            throw new SDKError(
                responseJson?.error || "Unknown error",
                response.status
            );
        }
    
        return {
            data: {
                message: responseJson.data.message
            }
        };
    }
    

}
