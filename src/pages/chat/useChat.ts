import { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useChatStore } from '@/pages/chat/store/chatStore';

export const useChat = () => {
    const history = useHistory();
    const { sessionId: urlSessionId } = useParams<{ sessionId?: string }>();
    const sessionId = useChatStore(s => s.sessionId);
    const setSessionId = useChatStore(s => s.setSessionId);
    const prevSessionIdRef = useRef(sessionId);

    // URL → Store：路由参数变化时同步到 store
    useEffect(() => {
        if (urlSessionId) {
            setSessionId(Number(urlSessionId));
        }
    }, [urlSessionId, setSessionId]);

    // Store → URL：store 中 sessionId 变化时同步到 URL
    useEffect(() => {
        if (sessionId && sessionId !== prevSessionIdRef.current) {
            history.replace(`/chat/${sessionId}`);
        }
        prevSessionIdRef.current = sessionId;
    }, [sessionId, history]);
};
