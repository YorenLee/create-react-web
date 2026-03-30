import { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useChatStore } from '@/pages/chat/store/chatStore';

export const useChat = () => {
    const history = useHistory();
    const { sessionId: urlSessionId } = useParams<{ sessionId?: string }>();
    const sessionId = useChatStore(s => s.sessionId);
    const setSessionId = useChatStore(s => s.setSessionId);
    const fetchSessionMessages = useChatStore(s => s.fetchSessionMessages);
    const historyLoaded = useChatStore(s => s.historyLoaded);
    const messages = useChatStore(s => s.messages);
    const prevSessionIdRef = useRef(sessionId);

    // URL → Store：路由参数变化时同步到 store，并拉取历史消息
    useEffect(() => {
        if (urlSessionId) {
            const numericId = Number(urlSessionId);
            setSessionId(numericId);

            if (messages.length === 0 && !historyLoaded) {
                fetchSessionMessages(numericId);
            }
        }
    }, [urlSessionId, setSessionId, fetchSessionMessages, historyLoaded, messages.length]);

    // Store → URL：store 中 sessionId 变化时同步到 URL
    useEffect(() => {
        if (sessionId && sessionId !== prevSessionIdRef.current) {
            history.replace(`/chat/${sessionId}`);
        }
        prevSessionIdRef.current = sessionId;
    }, [sessionId, history]);
};
