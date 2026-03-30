export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface ChatState {
    messages: ChatMessage[];
    loading: boolean;
    error: string | null;
    sessionId: number | null;
    streamingContent: string;
}

export interface SSESessionEvent {
    sessionId: number;
}

export interface SSEDeltaEvent {
    content: string;
}

export interface SSEDoneEvent {
    sessionId: number;
    content: string;
}

export interface SSEErrorEvent {
    message: string;
}
