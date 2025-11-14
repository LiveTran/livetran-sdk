export interface SelfHostedLiveTranConfig {
    sharedSecret: string;
    baseURL:   string;
}


export interface SelfHostedStartArgs {
    stream_id:    string;
    webhook_urls: string[];
    abr:          boolean;
}

export interface SelfHostedStopArgs {
    stream_id:    string
}



export interface SelfHostedServerResponse {
    success: boolean;
    data?: string
    error?: {
        message: string;
        // TODO: Make better Error handlers
    }
}