import { SelfHostedLiveTranConfig, SelfHostedServerResponse, SelfHostedStartArgs, SelfHostedStopArgs } from '../types/config'
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