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

export interface LiveTranConfig {
    sharedSecret: string;
    baseURL:   string;
    projectID: string;
    apiKey: string;
}

export interface LiveTranStartArgs {
    title:      string;
    description?: string;

    stream_key: string;
}

export interface LiveTranStopArgs {
    stream_key: string;
}


export interface ApiError {
    message: string;
}
  
export interface ApiSuccess<T> {
    data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | { error: ApiError };

export interface StartResponseData {
    srt_url: string;
    output_url: string;
}
export interface StopResponseData {
    message: string;
}

export type StartResponse = ApiResponse<StartResponseData>;
export type StopResponse = ApiResponse<StopResponseData>;

