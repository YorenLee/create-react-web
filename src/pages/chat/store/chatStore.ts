import { create } from 'zustand';
import jsCookie from 'js-cookie';
import { TokenKey } from '@/constant/index';
import type {
    ChatMessage,
    SSESessionEvent,
    SSEDeltaEvent,
    SSEDoneEvent
} from '@pages/chat/types';

const NOVEL_ID = 1;

function parseSSELines(text: string): Array<{ event?: string; data: string }> {
    const results: Array<{ event?: string; data: string }> = [];
    const lines = text.split('\n');
    let currentEvent: string | undefined;
    let currentData = '';

    for (const line of lines) {
        if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
            currentData = line.slice(6);
        } else if (line === '') {
            if (currentData) {
                results.push({ event: currentEvent, data: currentData });
                currentEvent = undefined;
                currentData = '';
            }
        }
    }

    return results;
}

interface ChatStore {
    messages: ChatMessage[];
    loading: boolean;
    error: string | null;
    sessionId: number | null;
    streamingContent: string;
    historyLoaded: boolean;

    abortController: AbortController | null;

    setSessionId: (id: number | null) => void;
    clearError: () => void;
    resetChat: () => void;
    sendMessage: (message: string) => Promise<void>;
    fetchSessionMessages: (sessionId: number) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    loading: false,
    error: null,
    sessionId: null,
    streamingContent: '',
    historyLoaded: false,
    abortController: null,

    setSessionId: (id) => set({ sessionId: id }),

    clearError: () => set({ error: null }),

    resetChat: () => {
        const { abortController } = get();
        abortController?.abort();
        set({
            messages: [],
            loading: false,
            error: null,
            sessionId: null,
            streamingContent: '',
            historyLoaded: false,
            abortController: null
        });
    },

    fetchSessionMessages: async (sessionId: number) => {
        const { loading, historyLoaded } = get();
        if (loading || historyLoaded) return;

        set({ loading: true, error: null });

        try {
            const token = jsCookie.get(TokenKey);
            const response = await fetch(`/api/agent/sessions/${sessionId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`加载历史消息失败: ${response.status}`);
            }

            const result = await response.json();
            const data: Array<{ role: string; content: string; createdAt: string }> = result.data ?? result;

            const messages: ChatMessage[] = data.map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
                timestamp: new Date(msg.createdAt).getTime()
            }));

            set({ messages, sessionId, historyLoaded: true, loading: false });
        } catch (err: any) {
            set({
                loading: false,
                error: err.message || '加载历史消息失败'
            });
        }
    },

    sendMessage: async (message: string) => {
        const { loading, sessionId } = get();
        if (!message.trim() || loading) return;

        get().abortController?.abort();
        const controller = new AbortController();

        const userMessage: ChatMessage = {
            role: 'user',
            content: message.trim(),
            timestamp: Date.now()
        };

        set(state => ({
            messages: [...state.messages, userMessage],
            loading: true,
            error: null,
            streamingContent: '',
            abortController: controller
        }));

        let streamingBuffer = '';
        const token = jsCookie.get(TokenKey);
        const body: Record<string, unknown> = {
            novelId: NOVEL_ID,
            message: message.trim()
        };
        if (sessionId) {
            body.sessionId = sessionId;
        }

        try {
            const response = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`请求失败: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('无法获取响应流');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const events = parseSSELines(buffer);
                const lastNewline = buffer.lastIndexOf('\n\n');
                buffer = lastNewline >= 0 ? buffer.slice(lastNewline + 2) : buffer;

                for (const evt of events) {
                    if (evt.event === 'session') {
                        const data: SSESessionEvent = JSON.parse(evt.data);
                        set({ sessionId: data.sessionId });
                    } else if (evt.event === 'delta') {
                        const data: SSEDeltaEvent = JSON.parse(evt.data);
                        streamingBuffer += data.content;
                        set({ streamingContent: streamingBuffer });
                    } else if (evt.event === 'done') {
                        const data: SSEDoneEvent = JSON.parse(evt.data);
                        const assistantMessage: ChatMessage = {
                            role: 'assistant',
                            content: data.content,
                            timestamp: Date.now()
                        };
                        set(state => ({
                            messages: [...state.messages, assistantMessage],
                            loading: false,
                            streamingContent: '',
                            sessionId: data.sessionId
                        }));
                        streamingBuffer = '';
                    } else if (evt.event === 'error') {
                        const data = JSON.parse(evt.data);
                        set({
                            loading: false,
                            error: data.message || '服务器错误',
                            streamingContent: ''
                        });
                        streamingBuffer = '';
                    }
                }
            }

            if (streamingBuffer) {
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: streamingBuffer,
                    timestamp: Date.now()
                };
                set(state => ({
                    messages: [...state.messages, assistantMessage],
                    loading: false,
                    streamingContent: ''
                }));
            }
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            set({
                loading: false,
                error: err.message || '请求失败',
                streamingContent: ''
            });
        }
    }
}));
